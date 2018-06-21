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
	var findAccount = 'SELECT * FROM user WHERE authority > '+auth+' order by authority ASC,name ASC';
	connection.query(findAccount, function(err, results) {
		if (results[0]) {
			global.gAccount = results;
		}
		connection.close;
		callback();
	});
}
