var mysql = require('mysql');

module.exports = function(accountId, accountAuthority, callback) {

	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'SaintJohn',
		password: '26892681147',
		database:'documentmaster'
	});

	connection.connect();	
	//查询
	var changeAccountAuthority = 'UPDATE user SET authority = '+accountAuthority+' WHERE id = '+accountId;
	connection.query(changeAccountAuthority, function(err) {
		connection.close;
		callback();
	});
}
