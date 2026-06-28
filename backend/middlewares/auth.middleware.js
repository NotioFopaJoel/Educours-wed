const { verifyAccessToken } = require('../utils/generateToken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Access token is required');
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new ApiError(401, 'Access token has expired');
      }
      throw new ApiError(401, 'Invalid access token');
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      throw new ApiError(401, 'User not found');
    }
    if (!user.isActive) {
      throw new ApiError(403, 'Account has been deactivated');
    }

    req.user = user;
    req.userId = user._id;
    req.userRole = user.role;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { authenticate };
