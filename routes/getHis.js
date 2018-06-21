var mysql = require('mysql');

module.exports = function(strPeople, callback) {

	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'SaintJohn',
		password: '26892681147',
		database:'documentmaster'
	});

	connection.connect();	
	//查询
	var getHis = 'SELECT * FROM history WHERE '+ strPeople +' order by hDate DESC,hName ASC';
	connection.query(getHis, function(err, results) {
		if (results[0]) {
			global.gDownloadHistory = results;
		}
		connection.close;
		callback();
	});
}
