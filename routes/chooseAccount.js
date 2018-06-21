var mysql = require('mysql');

module.exports = function(id, callback) {

	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'SaintJohn',
		password: '26892681147',
		database:'documentmaster'
	});

	connection.connect();	
	//查询
	var chooseAccount = 'SELECT * FROM applynewaccount WHERE id = '+id;
	connection.query(chooseAccount, function(err, results) {
		if (results[0]) {
			global.gChooseAccount = results[0];
		}
		connection.close;
		callback();
	});
}
