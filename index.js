const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Schema = mongoose.Schema;

const app = express();
const { PORT = 3000 } = process.env;
app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: 'http://localhost:5173',
  })
);

mongoose.connect('mongodb://localhost:27017/wccdb');

const userSchema = new Schema(
  {
    username: { type: String, unique: true },
    result: Number,
  },
  { versionKey: false }
);

const User = mongoose.model('User', userSchema);

// Получение всех юзеров
app.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.log('err ', error);
    res.status(500).send(error);
  }
});

// Создание нового юзера
app.post('/', (req, res) => {
  const { username, result } = req.body;

  const newUser = new User({
    username,
    result,
  });

  newUser
    .save()
    .then((savedUser) => {
      res.status(201).json(savedUser);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Обновление юзера

app.listen(PORT);
