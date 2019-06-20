const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const EnvInterface = require('./env-interface.js');



const env = new EnvInterface();
const dbUrl = `mongodb+srv://${ env.user }:${ env.pass }@thykka-fso2k19-cswvc.mongodb.net/note-app?retryWrites=true&w=majority`;
mongoose.connect(dbUrl, { useNewUrlParser: true });



const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});
const Note = mongoose.model('Note', noteSchema);



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

// https://jsperf.com/generateid-01/1
const generateId = (items) => 1 + items.reduceRight(
  (max, item) => item.id < max ? max : item.id,
  -1
);

app.get(apiUrl, (req, res) => {
  Note.find({}).then(notes => res.json(notes));
});

/*
app.get(apiUrl, (req, res) => {
  res.json(notes);
});
*/
app.get(apiUrl + '/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const note = notes.find(note => note.id === id);

  if(!note) {
    res.status(404).end();
    return;
  }
  res.json(note);
});

app.post(apiUrl, (req, res) => {
  const { content, important } = req.body;
  if(!content) {
    return res.status(400).json({
      error: 'no content'
    });
  }

  const note = {
    content,
    important: !!important,
    date: new Date(),
    id: generateId(notes)
  };

  notes = [ ...notes, note ];

  res.json(note);
});

app.delete(apiUrl + '/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  notes = notes.filter(note => note.id !== id);

  res.status(204).end();
  console.log(notes);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log('Listening: http://localhost:' + PORT);
});

