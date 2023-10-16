const BlacklistedToken = require('../models/BlacklistedToken');

const checkExistingToken = async (req, res, next) => {
  try {
    const user = req.user;
    const existingToken = await BlacklistedToken.findOne({ userId: user._id });
    
    if (existingToken) {
     
      return res.status(401).json({ message: 'User already logged in on another device' });
    }

    const blacklistedToken = new BlacklistedToken({ token: req.token, userId: user._id });
    await blacklistedToken.save();

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = checkExistingToken;

