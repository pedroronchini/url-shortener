const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if(!authHeader) {
    return res.status(401).send({ error: 'No token provided' });
  }

  const parts = authHeader.split('  ');

  if (parts.length !== 2) {
    return res.status(401).send({ error: 'Token error' });
  }

  const [ scheme, token ] = parts;

  if (!/^Bearer$/.test(scheme)) {
    return res.status(401).send({ error: 'Token error' });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(404).send({ error: 'Token invalid' });
    }

    req.userId = decoded.userId;
    return next();
  });
}