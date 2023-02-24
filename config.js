const {join} = require("path");
const config = {
    port: 1000,
    path: {
        articleImage: join(process.cwd(), 'static', 'public', 'images', 'articles'),
    }
}

global.config = config;

module.exports = config;