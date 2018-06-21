var mysql = require('mysql');

module.exports = function(accountId, callback) {

	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'SaintJohn',
		password: '26892681147',
		database:'documentmaster'
	});

	connection.connect();	
	//查询
	var deleteAccount = 'DELETE FROM user WHERE id = '+accountId;
	connection.query(deleteAccount, function(err) {
		connection.close;
		callback();
	});
}
