var mysql = require('mysql');

module.exports = function(NAid, callback) {

	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'SaintJohn',
		password: '26892681147',
		database:'documentmaster'
	});

	connection.connect();	
	//查询
	var deleteNewAccount = 'DELETE FROM applynewaccount WHERE id = '+NAid;
	connection.query(deleteNewAccount, function(err) {
		connection.close;
		callback();
	});
}
