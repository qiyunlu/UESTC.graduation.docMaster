var mysql = require('mysql');

module.exports = function(name, password, authority, mailbox, phone, sign, callback) {

	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'SaintJohn',
		password: '26892681147',
		database:'documentmaster'
	});

	connection.connect();	
	//查询
	var insertUser = 'INSERT INTO user (name,password,authority,mailbox,phone,sign) VALUES("'+name+'","'+password+'","'+authority+'","'+mailbox+'","'+phone+'","'+sign+'")';
	connection.query(insertUser, function(err) {
		connection.close;
		callback();
	});
}
