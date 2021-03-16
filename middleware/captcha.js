const Captcha = require('svg-captcha');
module.exports = () => {
    return Captcha.create({
        size: 4,
        ignoreChars: "0oilIi",
        noise: 3,
        color: true,
        background: "#fff",
        fontSize:60
    });
}