const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const analyzeRouter = require('./routes/analyze');
const aiRouter = require('./routes/aiRoutes');
const fileRouter = require('./routes/fileRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Routes
app.use('/api/analyze', analyzeRouter);
app.use('/api/ai', aiRouter);
app.use('/api/files', fileRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Error:', err.message, ']');
  const status = err.status || err.statusCode || 500;
  res.status(status).json({ 
    error: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined 
  });
});

// Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Backend API running on http://localhost:${PORT}`);
  });
}

module.exports = app;
