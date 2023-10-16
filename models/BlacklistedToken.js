const mongoose = require('mongoose');
const blacklistedTokenSchema = new mongoose.Schema({
    token: { type: String, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  });
  
   const BlacklistedToken = mongoose.model('BlacklistedToken', blacklistedTokenSchema);

   module.exports = BlacklistedToken;
   