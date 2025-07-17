// routes/index.js (or your route file)
const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
  const errorMessage = req.session.errorMessage;
  req.session.errorMessage = null; // Clear the error message

  // Render your login page and pass the errorMessage variable to the template
  res.render('login', { errorMessage });
});
  module.exports = router;