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
	var chooseDoc = 'SELECT * FROM document WHERE docId = '+id;
	connection.query(chooseDoc, function(err, results) {
		if (results[0]) {
			global.gChooseDoc = results[0];
		}
		connection.close;
		callback();
	});
}
