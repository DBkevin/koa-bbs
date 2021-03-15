const path = require('path');

module.exports = {
    mode: "development",
    entry: "./src/app.scss",
    output: {
        path: path.resolve(__dirname, './public/css/'),
        filename: 'app.css',
        publicPath:'public'
    }
}
