const nodemailer = require('nodemailer');
const mailerConfig = require('../config/index');
class mail {
    taransporetr = null;

    constructor(mailOptions, config = mailerConfig) {
        this.taransporetr = nodemailer.createTransport(config.mailConfig);
        this.sendMail(mailOptions);
    }
    sendMail(mailOptions) {
       this.taransporetr.sendMail(mailOptions, (err, info) => {
            if (err) {
                return false;
            }
            return true;
        });
    }
}
exports = module.exports = mail;