const express = require('express')
const app = express()
const ejs = require('ejs')
var path = require('path');
const expressSession = require('express-session')
var logger = require('morgan');
const flash = require('connect-flash')
const indexController = require('./controllers/indexController')
const authController = require('./controllers/authController')
const cors = require('cors');
global.loggedIn = null

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(expressSession({
    secret: "Atlux168"
}))
app.use("*" , (req, res , next) => {
    loggedIn = req.session.userId
    next()
})
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use('/', indexController);
app.use('/auth', authController)
app.use(cors({
    origin: '*'
}));


app.listen(4000, () => {
    console.log("App listening on port 4000");
})



module.exports = app;