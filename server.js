const express = require('express');
const path = require('path');
const fs = require('fs');

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

// route return the index.html
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// route to GET notes from db.json
app.get('/api/notes', (req, res) => {
    const data = fs.readFileSync(path.join(__dirname, '/db/db.json'), 'utf8');
    const notes = JSON.parse(data);
    res.json(notes);
});

// route to post notes to db.json
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    const notesData = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));
    notesData.push(newNote);
    fs.writeFileSync('./db/db.json', JSON.stringify(notesData));
    res.json(newNote);
});


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
