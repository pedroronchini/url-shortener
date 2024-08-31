const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = {
  async register(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });

      if (user) {
        return res.status(400).send({ error: 'User already exists' });
      }

      user = await User.create({ email, password });

      const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY);

      res.json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: 'An error occurred during registration' });
    }
  },

  async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(400).send({ error: 'User not found' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).send({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY);

      res.json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: 'An error occurred during login' });
    }
  }
}
