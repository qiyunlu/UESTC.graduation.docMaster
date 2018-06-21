var mysql = require('mysql');

module.exports = function(str, callback) {

	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'SaintJohn',
		password: '26892681147',
		database:'documentmaster'
	});

	connection.connect();	
	//查询
	var getAA = 'SELECT * FROM applyNewAccount'+str;
	connection.query(getAA, function(err, results) {
		if (results[0]) {
			global.gNewAccount = results;
		}
		connection.close;
		callback();
	});
}
