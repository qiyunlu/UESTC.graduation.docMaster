var mysql = require('mysql');

module.exports = function(name, passwordSHA1, mailbox, phone, introduction, callback) {

	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'SaintJohn',
		password: '26892681147',
		database:'documentmaster'
	});

	connection.connect();	
	//查询
	var insertNewAccount = 'INSERT INTO applynewaccount (name,password,mailbox,phone,introduction) VALUES("'+name+'","'+passwordSHA1+'","'+mailbox+'","'+phone+'","'+introduction+'")';
	connection.query(insertNewAccount, function(err) {
		connection.close;
		callback();
	});
}
