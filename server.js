const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');

const PORT = 3001;

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
    const notesData = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));
    const noteIndex = notesData.findIndex((note) => note.id === req.params.id);
    notesData.splice(noteIndex, 1);
    fs.writeFileSync('./db/db.json', JSON.stringify(notesData));
    res.json(notesData);
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
