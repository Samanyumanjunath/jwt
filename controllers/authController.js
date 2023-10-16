const User = require("../models/User");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');


let transporter = nodemailer.createTransport({
  service: 'gmail', // you can use any other email service
  auth: {
      user: 'samanyu.2021@vitstudent.ac.in',
      pass: 'cfgrfogrlucutlxn'
  }
});

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'secretKey', {
    expiresIn: maxAge
  });
};

// controller actions
module.exports.signup_get = (req, res) => {
  res.render('signup');
}

module.exports.login_get = (req, res) => {
  res.render('login');
}

// module.exports.signup_post = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.create({ email, password });
//     const token = createToken(user._id);
//     res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
//     res.status(201).json({ user: user._id });
//   }
//   catch(err) {
//     const errors = handleErrors(err);
//     res.status(400).json({ errors });
//   }
 
// }
module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({  email, password, emailVerified: false });
    // const user= new User({email,password});
    // const registeredUser= await User.register(user,password);
    // console.log(registeredUser);
    const token = createToken(user._id);
    const emailToken = jwt.sign({ id: user._id },'secretKey', { expiresIn: '1d' });
console.log(emailToken);
console.log(token);

    

    var mailOptions = {
      from: 'samanyumanjunath1@gmail.com',
      to: user.email,
      subject: 'Email Confirmation',
      text: `Please confirm your email address by clicking the following link: \nhttp:\/\/` + req.headers.host + `\/confirm\/` + emailToken + `\n\n`
    };

    // send the email
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Confirmation email sent: ' + info.response);
      }
    });

    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
}
// module.exports.login_post = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.login(email, password);
//     const token = createToken(user._id);
//     res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
//     req.session.user = user;
//     res.status(200).json({ user: user._id });
//   } 
//   catch (err) {
//     const errors = handleErrors(err);
//     res.status(400).json({ errors });
//   }

// }
module.exports.login_post =  async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    // res.cookie("testtoken", "abc123", { httpOnly: true });
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    req.session.user = user;
    res.status(200).json({ user: user._id });
  } 
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
}


module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  req.session.destroy();
  res.redirect('/');
}