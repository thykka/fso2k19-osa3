// mongoDB.net credentials are loaded from environment variables; DB_USER, DB_PASS

// See https://github.com/motdotla/dotenv if you want to permanently store these on your system.
// $ npm install dotenv

// If using dotenv, check if creds are loaded by uncommenting:
// console.log(require('dotenv').config());

const mongoose = require('mongoose');

let dbUser, dbPass;

if(process.argv.length <= 2) {
  console.log('Attempting login with environment credentials');
  dbUser = process.env.DB_USER;
  dbPass = process.env.DB_PASS;
  console.log(dbUser);
} else {
  dbUser = process.argv[2];
  dbPass = process.argv[3];
}

if(!dbUser || !dbPass) {
  console.log('Missing login credentials. Add <dbUser> <dbPass> as arguments.');
  process.exit(1);
}

const dbUrl = `mongodb+srv://${ dbUser }:${ dbPass }@thykka-fso2k19-cswvc.mongodb.net/note-app?retryWrites=true&w=majority`;

mongoose.connect(dbUrl, { useNewUrlParser: true });

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

const Note = mongoose.model('Note', noteSchema);

const note = new Note({
  content: 'HTML is EZ',
  date: new Date(),
  important: true
});

note.save().then(() => {
  console.log('Note saved;', note.content);
  mongoose.connection.close();
});
