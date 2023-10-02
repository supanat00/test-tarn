const express = require('express');
const router = express.Router();
const isLogin = require('../middleware/redirectifAuth')

router.get('/' , isLogin, function(req, res , next) {
    res.render("index");
})

module.exports = router;