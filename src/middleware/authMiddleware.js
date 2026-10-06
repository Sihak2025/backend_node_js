/** @format */

import jwt from 'jsonwebtoken';
import { prisma } from '../config/db.js';

// Read the token from the request
// Check if token is valid

const authMiddleware = async (req, res, next) => {
  console.log('Auth middleware ');
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.status(401).json({
      error: 'Not authrized, no token provided',
    });
  }

  //verify token and extract the user id
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        error: 'User no longer exists',
      });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      error: 'Not authrized, token failed',
    });
  }
};

export { authMiddleware };
