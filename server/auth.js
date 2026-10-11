import jwt from 'jsonwebtoken';

export function createToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' });
}

export function requireAuth(requiredRole) {
  return (req, res, next) => {
    const authorization = req.get('authorization') || '';
    const [scheme, token] = authorization.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Authentication is required.' });
    }

    try {
      req.auth = jwt.verify(token, process.env.JWT_SECRET);
      if (requiredRole && req.auth.role !== requiredRole) {
        return res.status(403).json({ message: 'You do not have permission to perform this action.' });
      }
      return next();
    } catch {
      return res.status(401).json({ message: 'Your session is invalid or has expired.' });
    }
  };
}
