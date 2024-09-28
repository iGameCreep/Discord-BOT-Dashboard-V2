// Please leave this file, this is used to import all commands!
const path = require("path");
const fs = require("fs");

const normalizedPath = path.join(__dirname);
const commands = {};

fs.readdirSync(normalizedPath).forEach(function (file) {
    if (file === "index.js") return; // Skip the index.js file itself
    const name = file.replace('.js', '');
    commands[name] = require(`./${file}`);
});

module.exports = commands; // Exporting an object with commands
