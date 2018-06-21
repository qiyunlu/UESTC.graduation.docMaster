var mysql = require('mysql');

module.exports = function(hName, hAuthor, hDLPeople, publicKey, privateKey, cpuModel, netMac, callback) {

	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'SaintJohn',
		password: '26892681147',
		database:'documentmaster'
	});

	connection.connect();	
	//查询
	var insertHistory = 'INSERT INTO history (hName,hAuthor,hDate,hDLPeople,publicKey,privateKey,cpuModel,netMac) VALUES("'+hName+'","'+hAuthor+'",now(),"'+hDLPeople+'","'+publicKey+'","'+privateKey+'","'+cpuModel+'","'+netMac+'")';
	connection.query(insertHistory, function(err) {
		connection.close;
		callback();
	});
}
