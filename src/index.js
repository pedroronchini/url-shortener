const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/urlShortener', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});