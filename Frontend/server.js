const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static assets (js, css, images)
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));

// Main Route - Homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Dynamic Route - Matches /dashboard, /profile, etc.
app.get('/:page', (req, res) => {
  const page = req.params.page;
  const filePath = path.join(__dirname, `${page}.html`);
  
  res.sendFile(filePath, (err) => {
    if (err) {
      // Fallback to index if page not found
      res.status(404).sendFile(path.join(__dirname, 'index.html'));
    }
  });
});

app.listen(PORT, () => {
  console.log(`\n🌐 Frontend running at http://localhost:${PORT}`);
  console.log(`   Serving: index.html, dashboard.html\n`);
});
