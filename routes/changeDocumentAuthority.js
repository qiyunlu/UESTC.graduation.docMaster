var mysql = require('mysql');

module.exports = function(documentId, documentAuthority, callback) {

	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'SaintJohn',
		password: '26892681147',
		database:'documentmaster'
	});

	connection.connect();	
	//查询
	var changeDocumentAuthority = 'UPDATE document SET docAuthority = '+documentAuthority+' WHERE docId = '+documentId;
	connection.query(changeDocumentAuthority, function(err) {
		connection.close;
		callback();
	});
}
