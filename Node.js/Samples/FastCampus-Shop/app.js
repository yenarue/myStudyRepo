const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const passport = require('passport');
const session = require('express-session');

/////DB
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {
    console.log('mongodb connect');
})
const connect = mongoose.connect('mongodb://127.0.0.1:27017/fastcampus', { useMongoClient : true});
autoIncrement.initialize(connect);
/////

const admin = require('./routes/admin');
const contacts = require('./routes/contacts');
const accounts = require('./routes/accounts');

const app = express();
const port = 3000;


// *.ejs View Engine을 추가한다
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.send('It is my first web app');
});

// Upload Path
app.use('/uploads', express.static('uploads'));

// Middlewares
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(cookieParser());

/**************** 라우팅 이전에 셋팅되어야 한다 ****************/
//session 관련 셋팅
app.use(session({
    secret: 'fastcampus',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 2000 * 60 * 60 //지속시간 2시간
    }
}));
 
//passport 적용
app.use(passport.initialize());
app.use(passport.session());
 
//플래시 메시지 관련
app.use(flash());
/************************************************************/

// Routing :-)
app.use('/admin', admin);
app.use('/contacts', contacts);
app.use('/accounts', accounts);

app.listen(port, () => {
   console.log('Express listening on port', port); 
});