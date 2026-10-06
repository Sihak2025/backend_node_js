
const checkRole = (allowRole) => {
  return (req, res, next) => {
    // 1. Ensure the user is authenticated first
    if (!req.user) {
      return res
        .status(401)
        .json({ error: 'Unauthorized. Please log in first.' });
    }

    // 2. Check if the user's role is included in the allowed roles array
    if (!allowRole.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied. Requires one of the following roles: ${allowRole.join(', ')}`,
      });
    }

    // 3. User has the correct role, proceed to the route handler
    next();
  };
};

export { checkRole };
