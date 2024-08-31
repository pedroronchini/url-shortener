const Url = require('../models/url');
const shortid = require('shortid');

module.exports = {
  async shorten(req, res) {
    const { originalUrl } = req.body;
    const shortUrl = shortid.generate().slice(0, 6);

    if (!req.headers.authorization) {
      return res.status(200).send({ shortUrl });
    }

    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const userId = decoded.userId;

      const url = await Url.create({
        originalUrl,
        shortUrl,
        createBy: userId
      });

      return res.status(201).json(url);
    } catch {
      console.error(err);
      res.status(500).send({ error: 'An error occurred' });
    }
  },

  async listUrls(req, res) {
    try {
      const urls = await Url.findAll({
        where: { createdBy: req.userId, status: 'Y' }
      });

      return res.status(200).send(urls);
    } catch {
      console.error(err);
      res.status(500).send({ error: 'An error occurred' });
    }
  },

  async updateUrl(req, res) {
    const { id } = req.params;
    const { originalUrl } = req.body;

    try {
      const url = await Url.findOne({
        where: { id, createdBy: req.userId, status: 'Y' }
      });

      if (!url) {
        return res.status(404).send({ error: 'URL not found' });
      }

      url.originalUrl = originalUrl;
      url.updatedAt = new Date();
      await url.save;

      return res.json(url);
    } catch {
      console.error(err);
      res.status(500).send({ error: 'An error occurred' });
    }
  },

  async deleteUrl(req, res) {
    try {
      const { id } = req.params;

      const url = await Url.findOne({
        where: { id, createdBy: req.userId, status: 'Y' }
      });

      if (!url) {
        return res.status(404).send({ error: 'URL not found' });
      }

      url.status = 'N';
      url.deletedAt = new Date();
      await url.save;

      return res.status(204).json();
    } catch {
      console.error(err);
      res.status(500).send({ error: 'An error occurred' });
    }
  },

  async redirectUtl(req, res) {
    const { shortUrl } = re.params;

    const url = await Url.findOne({
      where: { shortUrl, status: Y }
    });

    if (!url) {
      return res.status(404).send({ error: 'URL not found' });
    }

    url.clicks += 1;
    await url.save();

    return res.redirect(url.originalUrl);
  }
}