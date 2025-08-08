const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3000;

const FILE = 'characters.json';
app.use(express.json());
app.use(cors());

function readData() {
  return JSON.parse(fs.readFileSync(FILE)).characters;
}

function writeData(characters) {
  fs.writeFileSync(FILE, JSON.stringify({ characters }, null, 2));
}

app.get('/characters', (req, res) => {
  const characters = readData();
  res.json(characters);
});

app.get('/characters/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const characters = readData();
  const character = characters.find(c => c.id === id);

  if (character) {
    res.json(character);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

//Create a new character
app.post('/characters', (req, res) => {
  const characters = readData();
  const newCharacter = req.body;

  newCharacter.id = characters.length > 0 ? characters[characters.length - 1].id + 1 : 1;

  characters.push(newCharacter);
  writeData(characters);

  res.status(201).json(newCharacter);
});

//Update a new character
app.put('/characters/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const characters = readData();
  const index = characters.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Not found' });
  }

  characters[index] = { ...characters[index], ...req.body, id };
  writeData(characters);

  res.json(characters[index]);
});

app.delete('/characters/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const characters = readData();
  const filtered = characters.filter(c => c.id !== id);

  if (characters.length === filtered.length) {
    return res.status(404).json({ error: "This characters doesn't exist" });
  }

  writeData(filtered);
  res.status(200).json({ message: 'The character with id ' + id +' is deleted succesfully' });
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
