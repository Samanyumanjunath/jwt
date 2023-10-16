const { Router } = require('express');
const authController = require('../controllers/authController');
const { checkUser } = require('../middleware/authMiddleware');
const authenticateUser = require('../middleware/authenticateUser');
// const checkExistingToken = require('../middleware/checkExistingToken');
const captcha = require('../middleware/verifyCaptcha')
// const logout = require('../middleware/logout');
const User=require('../models/User');
const router = Router();
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });


// const csrfAttack= ((err, req, res, next) => {
//   if (err.code !== "EBADCSRFTOKEN") return next(err)

//   res.status(403)
//   res.json("message:CSRF attack detected!")
// })

router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login',  captcha, authenticateUser,authController.login_post);
router.get('/logout', authController.logout_get);
router.get('/confirm/:emailToken', async (req, res) => {
    try {
      const token = req.params.token;
      const user = await User.findOne({ token });
  
      if (!user) {
        return res.status(400).json({ errors: 'Invalid token' });
      }
  
      user.emailVerified = true;
      await user.save();
  
      res.status(200).json({ message: 'Email confirmed successfully' });
    } catch (err) {
      res.status(400).json({ errors: 'Error confirming email' });
    }
  });
  router.get('/get-user-data',csrfProtection,(req, res) => {
 
  
    res.send(`<form action="/transfer-money" method="GET">
  
      <input type="hidden" name="_csrf" value="${req.csrfToken()}">
    
    </form>`)
  });

  
  module.exports = router;