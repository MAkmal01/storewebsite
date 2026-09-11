import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'royal-choice-admin-secret-key-2024';

export const generateToken = (adminId) => {
  return jwt.sign({ id: adminId, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
};

export const adminAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    req.adminId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

export default adminAuth;
