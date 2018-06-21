var mysql = require('mysql');

module.exports = function(id, password, callback) {

	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'SaintJohn',
		password: '26892681147',
		database:'documentmaster'
	});

	connection.connect();	
	//查询
	var changeUserPassword = 'UPDATE user SET password = "'+password+'" WHERE id = '+id;
	connection.query(changeUserPassword, function(err) {
		connection.close;
		callback();
	});
}
