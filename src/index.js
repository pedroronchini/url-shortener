const express = require('express');
const sequelize = require('./config/database');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  console.log('Database synchronized');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});

app.use(express.json());
app.use(routes);
