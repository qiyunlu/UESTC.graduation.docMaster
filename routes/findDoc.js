var mysql = require('mysql');

module.exports = function(auth, callback) {

	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'SaintJohn',
		password: '26892681147',
		database:'documentmaster'
	});

	connection.connect();	
	//查询
	var findDoc = 'SELECT * FROM document WHERE docAuthority >= '+auth+' order by docDate DESC,docId DESC';
	connection.query(findDoc, function(err, results) {
		if (results[0]) {
			global.gDocument = results;
		}
		connection.close;
		callback();
	});
}
