const express = require('express');
const router = express.Router();
const discord = require('../bot');
const { ensureAuthenticated } = require('../auth/auth');
const commands = require("../commands");
const fs = require("fs");
const jsonfile = require('jsonfile');
const themes = "./config/theme.json";

router.get('/plugins', ensureAuthenticated, (req, res) => {
    const theme = jsonfile.readFileSync(themes);
    const commandsToggle = jsonfile.readFileSync('./config/settings.json');
    fs.readdir("./commands/", (err, files) => {
        res.render('home/plugins', {
            profile: req.user,
            client: discord.client,
            commands: commands,
            commandName: files,
            commandsToggle: commandsToggle,
            theme: theme
        })
    })
});

router.post('/plugins/remove/:plugin', ensureAuthenticated, function (req, res) {
    try {
        fs.unlinkSync('./commands/' + req.params.plugin)
        req.flash('success', `Plugin ${req.params.plugin} was successfully removed!`)
        res.redirect('/plugins')
    } catch (err) {
        console.error(err)
    }
})

router.post('/plugins/toggle', ensureAuthenticated, function (req, res) {
    // Remove plugin from settings file
    if (req.body.toggle == "true") {
        fs.readFile('./config/settings.json', function (err, data) {
            const json = JSON.parse(data);
            if (!json.includes(req.body.commandName)) {
                req.flash('error', `Error`);
                res.redirect('/plugins');
                return;
            }
            json.splice(json.indexOf(`${req.body.commandName}`), 1);
            fs.writeFile("./config/settings.json", JSON.stringify(json), function (err) {
                if (err) throw err;
                res.redirect('/plugins');
            });
        });
    }

    // Add plugin to settings file
    if (req.body.toggle == "false") {
        fs.readFile('./config/settings.json', function (err, data) {
            const json = JSON.parse(data);
            if (json.includes(req.body.commandName)) {
                req.flash('error', `Error`);
                res.redirect('/plugins');
                return;
            }
            json.push(`${req.body.commandName}`);
            fs.writeFile("./config/settings.json", JSON.stringify(json), function (err) {
                if (err) throw err;
                res.redirect('/plugins');
            });
        });
    }
});

router.post('/plugins/upload', ensureAuthenticated, function (req, res) {
    let sampleFile;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
        req.flash('error', `No file was uploaded, please try again!`);
        res.redirect('/plugins');
        return;
    }
    if (!req.files.sampleFile.name.endsWith(".js")) {
        req.flash('error', `Please only upload Javascript files!`);
        res.redirect('/plugins');
        return;
    }

    const path = './commands/' + req.files.sampleFile.name;
    if (fs.existsSync(path)) {
        req.flash('error', `Plugin with that name already exists!`);
        res.redirect('/plugins');
        return;
    }

    sampleFile = req.files.sampleFile;
    uploadPath = './commands/' + sampleFile.name;

    sampleFile.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);

        req.flash('success', `Plugin ${sampleFile.name} successfully uploaded, please now restart Discord BOT Dashboard for changes to take effect!`);
        res.redirect('/plugins');
    });
});

module.exports = router;
