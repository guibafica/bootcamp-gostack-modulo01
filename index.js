const express = require('express'); 

const server = express();

server.use(express.json());

// GET => Busca
// POST => Cria
// PUT => Modifica

// Query params = ?teste=1
// Route params = /users/1
// Request body = { "nome": "Guilherme", "email": "gb.engcomp@hotmail.com" }

// CRUD - Create, Read, Update, Delete

const users = ['Pizza', 'Ianic', 'Rafaelito'];

server.use((req, res, next) => {
  console.time('Request');
  console.log(`Método: ${req.method}; URL: ${req.url}`);

  next();

  console.timeEnd('Request');
});

function checkUserExists(req, res, next) {
  if(!req.body.name) {
    return res.status(400).json({ error: 'User name not found on request body' });
  }

  return next();
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];

  if(!user) {
    return res.status(400).json({ error: 'User does not exisits' });
  }

  req.user = user;

  return next();
}

server.get('/users', (req, res) => {
  return res.json(users); 
})

// localhost:3000/teste
server.get('/users/:index', checkUserInArray,(req, res) => {
  return res.json(req.user);
}) 

// Criação de usuários
server.post('/users', checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

server.put('/users/:index', checkUserInArray, checkUserExists, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
});

server.delete('/users/:index', checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1); 

  return res.send();
});

server.listen(3000);