const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// route return the index.html
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// route return the notes.html
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// route to GET notes from db.json
app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
    } else {
        // Convert string into JSON object
        const savedNotes = JSON.parse(data);
        res.json(savedNotes);
    }
  });

});

// route to post notes to db.json
app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = uuid();
  const notesTosave = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));
  
  notesTosave.push(newNote);
  fs.writeFileSync('./db/db.json', JSON.stringify(notesTosave));
  res.json(newNote);
});

//route to delete notes from db.json
app.delete('/api/notes/:id', (req, res) => {
  const notesTosave = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));
  const index = notesTosave.findIndex((note) => note.id === req.params.id);
  notesTosave.splice(index, 1);
  fs.writeFileSync('./db/db.json', JSON.stringify(notesTosave));
  res.json(notesTosave);
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
