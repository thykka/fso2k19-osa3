const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const Note = require('./models/note');

const apiUrl = '/api/notes';

app.use(cors());
app.use(express.static('build'));
app.use(bodyParser.json());

let notes = [
  {
    id: '000000',
    content: 'heheee',
    important: false,
  }
];

app.get(apiUrl, (req, res) => {
  Note.find({})
    .then(notes =>
      res.json(
        notes.map(note => note.toJSON())
      )
    );
});

app.get(apiUrl + '/:id', (req, res) => {
  const { id } = req.params;
  console.log('Fetching note ' + id);
  Note.findById(id)
    .then(note => res.json(note.toJSON()))
    .catch(err => res.json(err));
});

app.post(apiUrl, (req, res) => {
  const { content, important } = req.body;
  if(!content) {
    return res.status(400).json({
      error: 'no content'
    });
  }

  const note = new Note({
    content,
    important: !!important,
    date: new Date()
  });

  note.save()
    .then(savedNote =>
      res.json(savedNote.toJSON())
    );
});

app.delete(apiUrl + '/:id', (req, res) => {
  Note.findOneAndDelete(
    { _id: req.params.id },
    () => res.status(204).end()
  );
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log('Listening: http://localhost:' + PORT);
});

