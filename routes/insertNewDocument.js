var mysql = require('mysql');

module.exports = function(docName, docContain, docOwner, docIntroduction, docAuthority, callback) {

	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'SaintJohn',
		password: '26892681147',
		database:'documentmaster'
	});

	connection.connect();	
	//查询
	var insertNewDocument = 'INSERT INTO document (docName,docContain,docOwner,docDate,docAuthority,docIntroduction) VALUES("'+docName+'","'+docContain+'","'+docOwner+'",now(),"'+docAuthority+'","'+docIntroduction+'")';
	connection.query(insertNewDocument, function(err) {
		connection.close;
		callback();
	});
}
