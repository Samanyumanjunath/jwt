const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const secretKey = 'secretKey';
const authenticateUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    
    const token = jwt.sign({ email: user.email }, secretKey);
    req.token = token; // store the token in the request object
    
    req.user = user; // store the user data in the request object for subsequent middleware to use 

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = authenticateUser;