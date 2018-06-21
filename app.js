var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/*', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// 全局变量
global.gUser = {
	// id
	// name
	// password
	// authority
	// mailbox
	// phone
	// passwordSHA1
	// sign
};
global.gDocument = [
	// this is a list of documents(Object) choosed in findDoc.js
	// docId
	// docName
	// docContain
	// docOwner
	// docDate
	// docAuthority
	// docIntroduction
];
global.gNewDocument = [
	// this is a list of document's applications(Object)
	// docId
	// docName
	// docContain
	// docOwner
	// docIntroduction
	// docPath
];
global.gDownloadHistory = [
	// this is a list of history(Object)
	// hId
	// hName
	// hAuthor
	// hDate
	// hDLPeople
	// publicKey
	// privateKey
	// cpuModel
	// netMac
];
global.gChooseId = 0; // just a id for a document choosed by somebody
global.gChooseDoc = {
	// a choosed document's information
};
global.gMachine = {
	// cpuModel
	// netMac
	// encryptModel
	// encryptMac
};
global.gSM2 = {
	// privateKey
	// publicKey
};
global.gMessage = ''; // message waiting to crypt
global.gCiphertext = ''; // message crypted already
global.gAccount = [
	// this is a list of all people(Object)
	// id
	// name
	// authority
	// mailbox
	// phone
	// passwordSHA1
	// sign
];
global.gNewAccount = [
	// this is a list of application of new people(Object)
	// id
	// name
	// passwordSHA1
	// mailbox
	// phone
	// introduction
];
global.gChooseAccount = {
	// a choosed account's information
};


module.exports = app;
