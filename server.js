const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// route display notes.html
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// route to GET notes from db.json
app.get('api/notes', (req, res) => {
    const data = fs.readFileSync(path.join('./db/', 'db.json'), 'utf8');
    const notes = JSON.parse(data);
    res.json(notes);
});


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
