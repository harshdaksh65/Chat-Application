const express = require('express');
const dotenv = require('dotenv');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

dotenv.config();

app.get('/', (req, res) => {
  res.send('Welcome to the Chat App Backend!');
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
