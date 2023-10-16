const express = require('express');
const request = require('request');
const app = express();

const SECRET_KEY = "6LcwVRwoAAAAABBSMlzf11mdz6aDv7P0TEbpqCu0";

const verifyCaptcha = (req, res, next) => {
    const gRecaptchaResponse = req.body['g-recaptcha-response'];

    if (!gRecaptchaResponse) {
        return res.status(400).json({message: 'reCAPTCHA response missing.'});
    }

    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${gRecaptchaResponse}`;

    request(verificationUrl, { json: true }, (err, response, body) => {
        if (err) {
            return res.status(500).json({ message: 'reCAPTCHA verification check error.' });
        }

        if (body.success === false) {
            return res.status(400).json({ message: 'reCAPTCHA verification failed. Are you a robot?' });
        }
        
        // if verification succeeded, continue with your process
        next();
    });
}
module.exports = verifyCaptcha;