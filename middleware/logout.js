// const BlacklistedToken = require('../models/BlacklistedToken');
// const user = require("../models/User");
// const logout = async (req, res, next) => {
//     try {
//         let user= res.locals.user ;
//         const token = req.cookies.jwt;
//       // Find the blacklisted token associated with the user's id and delete it
//       const deletedToken = await BlacklistedToken.findOneAndDelete({ userId: user._id, token: token });
  
//     //   // If no matching blacklisted token is found, send a relevant response
//     //   if (!deletedToken) {
//     //     return res.status(400).json({ message: 'Token not found in blacklist' });
//     //     res.redirect('/');
//     //   }
  
//       // Send a confirmation response
//       res.status(200).json({ message: 'Successfully logged out' });
//       next();
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   };
// module.exports=logout;  