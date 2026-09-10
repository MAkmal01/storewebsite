import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

/**
 * @route   GET /api/health
 * @desc    Get API & Database health status
 * @access  Public
 */
router.get('/health', (req, res) => {
  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const dbState = mongoose.connection.readyState;
  const dbStatus = dbStatusMap[dbState] || 'unknown';

  res.status(200).json({
    status: 'ok',
    message: 'MERN Stack API is operating normally',
    database: {
      status: dbStatus,
      host: mongoose.connection.host || null,
      name: mongoose.connection.name || null,
    },
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
  });
});

export default router;
