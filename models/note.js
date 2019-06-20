const mongoose = require('mongoose');

const EnvInterface = require('../env-interface.js');



const env = new EnvInterface();
const dbUrl = `mongodb+srv://${ env.user }:${ env.pass }@thykka-fso2k19-cswvc.mongodb.net/note-app?retryWrites=true&w=majority`;
mongoose.connect(dbUrl, { useNewUrlParser: true });

const Log = (...args) => {
  console.log('[M]', ...args);
};

mongoose.connect(dbUrl, { useNewUrlParser: true })
  .then(() => Log`connected`)
  .catch(err => Log`couldn't connect; ${ err.message }`);

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Note', noteSchema);
