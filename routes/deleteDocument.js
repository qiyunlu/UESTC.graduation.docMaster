var mysql = require('mysql');

module.exports = function(documentId, callback) {

	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'SaintJohn',
		password: '26892681147',
		database:'documentmaster'
	});

	connection.connect();	
	//查询
	var deleteDocument = 'DELETE FROM document WHERE docId = '+documentId;
	connection.query(deleteDocument, function(err) {
		connection.close;
		callback();
	});
}
