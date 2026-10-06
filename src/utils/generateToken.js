/** @format */

import jwt from 'jsonwebtoken';

export const generatetoken = async (userId, res) => {
  const payload = { id: userId };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.ENV_EXPIRES_IN || '7d',
  });
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'prduction',
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24,
  });
  return token;
};
