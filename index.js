const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

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
  res.json(notes);
});

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

