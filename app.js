const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('<h1>DevOps Capstone App</h1><p>Built with Jenkins, Docker and AWS.</p>');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

if (require.main === module) {
  app.listen(PORT, () => console.log('App running on port ' + PORT));
}

module.exports = app;
