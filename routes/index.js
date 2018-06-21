const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const crypto = require('crypto');

var findDoc = require('./findDoc');
var chooseDoc = require('./chooseDoc');
var insertHistory = require('./insertHistory');
var getHis = require('./getHis');
var sendMail = require('./sendMail');
var insertNewAccount = require('./insertNewAccount');
var changeUserSign = require('./changeUserSign');
var changeUserPassword = require('./changeUserPassword');

var findAccount = require('./findAccount');
var getAccountApplication = require('./getAccountApplication');
var changeAccountAuthority = require('./changeAccountAuthority');
var deleteAccount = require('./deleteAccount');
var chooseAccount = require('./chooseAccount');
var insertUser = require('./insertUser');
var deleteNewAccount = require('./deleteNewAccount');
var changeDocumentAuthority = require('./changeDocumentAuthority');
var deleteDocument = require('./deleteDocument');
var insertNewDocument = require('./insertNewDocument');

/* choose route */
router.post('/judge', function(req, res, next) {
	
	global.gUser.name = req.body.userName.toString();
	global.gUser.password = req.body.password.toString();
	
	var hash = crypto.createHash('sha1');
	hash.on('readable', () => {
		var data = hash.read();
		if (data)
		global.gUser.passwordSHA1 = data.toString('hex');
	});
	hash.write(global.gUser.password);
	hash.end();
	
	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'SaintJohn',
		password: '26892681147',
		database:'documentmaster'
	});

	connection.connect();	
	//查询
	var judge = 'SELECT * FROM user WHERE `name`="'+global.gUser.name+'"';
	connection.query(judge, function(err, results) {
		
		if(results[0]) {
			if (results[0].password === global.gUser.passwordSHA1) {
				global.gUser.id = results[0].id;
				global.gUser.authority = results[0].authority;
				global.gUser.mailbox = results[0].mailbox;
				global.gUser.phone = results[0].phone;
				global.gUser.sign = results[0].sign;
				if (global.gUser.authority === 1) {
					res.redirect('/whereYouWantToGo');
				} else if (global.gUser.authority <= 3) {
					res.redirect('/user_download');
				} else {
					res.render('notFriends');
				}
			} else {
				res.render('notFriends');
			}
		} else {
			res.render('notFriends');
		}
	});
	connection.close;
});



router.get('/register', function(req, res, next) {
	res.render('register');
});



router.get('/whereYouWantToGo', function(req, res, next) {
	if (global.gUser.authority === 1) {
		res.render('au_choose');
	} else {
		res.render('notFriends');
	}
});



router.get('/user_download', function(req, res, next) {
	if (global.gUser.authority <= 3) {
		findDoc(global.gUser.authority, function() {
			res.render('user_download');
		});
	} else {
		res.render('notFriends');
	}
});



router.get('/user_history', function(req, res, next) {
	if (global.gUser.authority <= 3) {
		getHis('hDLPeople = '+'"'+global.gUser.name+'"', function() {
			res.render('user_history');
		});
	} else {
		res.render('notFriends');
	}
});



router.get('/user_info', function(req, res, next) {
	if (global.gUser.authority <= 3) {
		var connection = mysql.createConnection({
			host: 'localhost',
			user: 'SaintJohn',
			password: '26892681147',
			database:'documentmaster'
		});

		connection.connect();	
		//查询
		var refresh = 'SELECT * FROM user WHERE id = '+global.gUser.id;
		connection.query(refresh, function(err, results) {
			if(results[0]) {
				global.gUser.passwordSHA1 = results[0].password;
				global.gUser.authority = results[0].authority;
				global.gUser.mailbox = results[0].mailbox;
				global.gUser.phone = results[0].phone;
				global.gUser.sign = results[0].sign;		
			}
			connection.close;
			res.render('user_info');
		});
	} else {
		res.render('notFriends');
	}
});



router.post('/exactInfo', function(req, res, next) {
	if (global.gUser.authority <= 3) {
		global.gChooseId = req.body.docId;
		chooseDoc(global.gChooseId, function() {
			fs.readFile(path.join(__dirname, '../documents/prototype/'+global.gChooseId+'.'+global.gChooseDoc.docName), function (err, data) {
		    	// 收集用户信息
				var os=require('os');
				// IP and CPU
				var cpus = os.cpus();
				var networkInterfaces = os.networkInterfaces();
				// note
				global.gMachine.cpuModel = cpus[0].model;
				if (networkInterfaces['WLAN']) {
					global.gMachine.netMac = networkInterfaces['WLAN'][0].mac;
				} else if (networkInterfaces['本地连接']) {
					global.gMachine.netMac = networkInterfaces['本地连接'][0].mac;
				} else {
					global.gMachine.netMac = null;
				}

		    	global.gMessage = data.toString();
		   		res.render('exactInfo', { innerDoc: global.gMessage });
			});
		});
	} else {
		res.render('notFriends');
	}
});



router.post('/docDownload', function(req, res, next) {
	if (global.gUser.authority <= 3) {
		
		// 文件加密公私钥对
		global.gSM2.publicKey = req.body.publickey;
		global.gSM2.privateKey = req.body.privatekey;
		// 密文
		global.gCiphertext = req.body.encryptdata;
		global.gMachine.encryptModel = req.body.encryptmodel;
		global.gMachine.encryptMac = req.body.encryptmac;

		// insert download information
		insertHistory(global.gChooseDoc.docName,global.gChooseDoc.docOwner,global.gUser.name,global.gSM2.publicKey,global.gSM2.privateKey,global.gMachine.cpuModel,global.gMachine.netMac, function() {
			// 生成release版本
			var htmlIndex = '<!DOCTYPE html><html><head><meta charset="utf-8" /><title>User Check</title><script src="./js/jquery-3.2.1.min.js"></script><script>function doA() {var Name = "'+global.gUser.name+'";var Password = "'
							+global.gUser.password+'";var name = document.form1.name.value;var password = document.form1.password.value;if (Name !== name) {window.location.href="./html/error.html";} else if (Password !== password)'
							+'{window.location.href="./html/error.html";} else {window.location.href="./html/index2.html";}}</script></head><body><h1>你是谁？</h1><form name="form1"><div>用户：<input type="text" name="name" /></div>'
							+'<div>密码：<input type="text" name="password" /></div><input type="button" value="验证" onclick="doA();" /></form></body></html>';
			fs.writeFile(path.join(__dirname, '../documents/package/index.html'), htmlIndex, function(err) {
				if (err) {
					return console.error(err);
				}
				var htmlIndex2 = '<!DOCTYPE html><html><head><meta charset="utf-8" /><title>Decrypt</title><script src="../js/core.js"></script><script src="../js/cipher-core.js"></script><script src="../js/md5.js"></script>'
								+'<script src="../js/tripledes.js"></script><script src="../js/enc-base64.js"></script><script src="../js/sha1.js"></script><script src="../js/sha256.js"></script><script src="../js/yahoo-min.js"></script>'
								+'<script src="../js/jsbn.js"></script><script src="../js/jsbn2.js"></script><script src="../js/prng4.js"></script><script src="../js/rng.js"></script><script src="../js/rsa.js"></script>'
								+'<script src="../js/rsa2.js"></script><script src="../js/base64.js"></script><script src="../js/asn1hex-1.1.js"></script><script src="../js/rsapem-1.1.js"></script><script src="../js/rsasign-1.2.js"></script>'
								+'<script src="../js/x509-1.1.js"></script><script src="../js/pkcs5pkey-1.0.js"></script><script src="../js/asn1-1.0.js"></script><script src="../js/asn1x509-1.0.js"></script>'
								+'<script src="../js/crypto-1.1.js"></script><script src="../js/ec.js"></script><script src="../js/ec-patch.js"></script><script src="../js/ecdsa-modified-1.0.js"></script><script src="../js/sm3.js"></script>'
								+'<script src="../js/sm3-sm2-1.0.js"></script><script src="../js/ecparam-1.0.js"></script><script src="../js/sm2.js"></script><script src="../js/jquery-3.2.1.min.js"></script><script>'
								+'var Data = "";function doD() {var CipherText = "'+global.gCiphertext+'";var pubkey = document.form1.authen.value;var publickeykey = new BigInteger(pubkey, 16);var cipher = new SM2Cipher(1);'
								+'Data = cipher.Decrypt(publickeykey, CipherText);}function doS() {document.getElementById("data").innerText = Data;}</script></head><body><h1>输入验证码解密文档</h1><form name="form1">'
								+'验证码：<input type="text" name="authen" /><b>&nbsp;</b><input type="button" value="点击解密" onclick="doD();" /></form><div>&nbsp;</div><div><b>警告：文件未显示说明验证码错误！</b></div>'
								+'<div><input type="button" value="点击查看" onclick="doS();" /></div><div><textarea id="data" cols=60 rows=25></textarea></div></body></html>'
				fs.writeFile(path.join(__dirname, '../documents/package/html/index2.html'), htmlIndex2, function(err) {
					if (err) {
						return console.error(err);
					}
					// release打包
					var cmd01 = 'G:\\DocMaster\\documents\\ToDoRelease.bat';
					exec(cmd01, function(err,stdout,stderr) {
						// download
						res.download(path.join(__dirname, '../documents/release.zip'), 'release.zip');
						// send mail
						sendMail(global.gUser.mailbox.toString(),'文件授权保护系统','文件"'+global.gChooseDoc.docName+'"的验证码为：'+global.gSM2.publicKey+'；请勿泄露！');
					});
				});
			});
		});

	} else {
		res.render('notFriends');
	}
});



router.post('/changeSign', function(req, res, next) {
	if (global.gUser.authority <= 3) {
		changeUserSign(global.gUser.id, req.body.sign, function(){
			res.render('good_change');
		});
	} else {
		res.render('notFriends');
	}
});



router.post('/changePassword', function(req, res, next) {
	if (global.gUser.authority <= 3) {
		var oldpass = req.body.oldpass;
		var newpass = req.body.newpass;
		var newpassSHA1 = '';
		if (global.gUser.password === oldpass) {

			var hash = crypto.createHash('sha1');
			hash.on('readable', () => {
				var data = hash.read();
				if (data)
				newpassSHA1 = data.toString('hex');
			});
			hash.write(newpass);
			hash.end();

			changeUserPassword(global.gUser.id, newpassSHA1, function(){
				global.gUser.password = newpass;
				res.render('good_change');
			});

		} else {
			res.render('bad_change');
		}
	} else {
		res.render('notFriends');
	}
});



router.get('/manager_index', function(req, res, next) {
	if (global.gUser.authority === 1) {
		findAccount(global.gUser.authority,function(){
			getAccountApplication("",function(){
				findDoc(global.gUser.authority,function(){
					res.render('manager_index');
				});
			});
		});
	} else {
		res.render('notFriends');
	}
});



router.get('/manager_Maccount', function(req, res, next) {
	if (global.gUser.authority === 1) {
		findAccount(global.gUser.authority,function(){
			res.render('manager_Maccount');
		});
	} else {
		res.render('notFriends');
	}
});



router.post('/changeAuthority', function(req, res, next) {
	if (global.gUser.authority === 1) {
		var accountId = req.body.accountId;
		var accountAuthority = req.body.accountAuthority;
		if(accountAuthority === "1") {
			res.redirect('/manager_Maccount');
		} else {
			changeAccountAuthority(accountId, accountAuthority, function(){
				res.redirect('/manager_Maccount');
			});
		}
	} else {
		res.render('notFriends');
	}
});



router.post('/deleteAccount', function(req, res, next) {
	if (global.gUser.authority === 1) {
		var accountId = req.body.accountId;
		deleteAccount(accountId, function(){
			res.redirect('/manager_Maccount');
		});
	} else {
		res.render('notFriends');
	}
});



router.get('/manager_Naccount', function(req, res, next) {
	if (global.gUser.authority === 1) {
		getAccountApplication("",function(){
			res.render('manager_Naccount');
		});
	} else {
		res.render('notFriends');
	}
});



router.post('/Naccount_info', function(req, res, next) {
	if (global.gUser.authority === 1) {
		chooseAccount(req.body.NaccountId,function(){
			res.render('Naccount_info');
		});
	} else {
		res.render('notFriends');
	}
});



router.post('/good_Naccount', function(req, res, next) {
	if (global.gUser.authority === 1) {
		global.gChooseAccount.authority = req.body.UT;
		insertUser(global.gChooseAccount.name,global.gChooseAccount.password,global.gChooseAccount.authority,global.gChooseAccount.mailbox,global.gChooseAccount.phone,global.gChooseAccount.sign,function(){
			deleteNewAccount(global.gChooseAccount.id,function(){
				sendMail(global.gChooseAccount.mailbox.toString(),'文件授权保护系统','您的账号"'+global.gChooseAccount.name+'"已通过注册；欢迎来到文件授权保护系统！');
				res.redirect('/manager_Naccount');
			});
		});
	} else {
		res.render('notFriends');
	}
});



router.get('/bad_Naccount', function(req, res, next) {
	if (global.gUser.authority === 1) {
		deleteNewAccount(global.gChooseAccount.id,function(){
			sendMail(global.gChooseAccount.mailbox.toString(),'文件授权保护系统','您的账号"'+global.gChooseAccount.name+'"未通过注册；您真是菜的抠脚！');
			res.redirect('/manager_Naccount');
		});
	} else {
		res.render('notFriends');
	}
});



router.get('/manager_Mdocument', function(req, res, next) {
	if (global.gUser.authority === 1) {
		findDoc(global.gUser.authority,function(){
			res.render('manager_Mdocument');
		});
	} else {
		res.render('notFriends');
	}
});



router.post('/changeDocAuth', function(req, res, next) {
	if (global.gUser.authority === 1) {
		var documentId = req.body.documentId;
		var docAuthority = req.body.docAuthority;
		changeDocumentAuthority(documentId, docAuthority, function(){
			res.redirect('/manager_Mdocument');
		});
	} else {
		res.render('notFriends');
	}
});



router.post('/deleteDocument', function(req, res, next) {
	if (global.gUser.authority === 1) {
		var documentId = req.body.documentId;
		var documentName = req.body.documentName;
		deleteDocument(documentId, function(){
			var cmd02 = 'del G:\\DocMaster\\documents\\prototype\\'+documentId+'.'+documentName;
			exec(cmd02, function(err,stdout,stderr) {
				res.redirect('/manager_Mdocument');
			});
		});
	} else {
		res.render('notFriends');
	}
});



router.get('/manager_Ndocument', function(req, res, next) {
	if (global.gUser.authority === 1) {
		res.render('manager_Ndocument');
	} else {
		res.render('notFriends');
	}
});



router.post('/good_Ndocument', function(req, res, next) {
	if (global.gUser.authority === 1) {
		var docId = 0;
		var docName = req.body.docName;
		var docContain = req.body.docContain;
		var docOwner = req.body.docOwner;
		var docIntroduction = req.body.docIntroduction;
		var docInnerText = req.body.docInnerText;
		var docAuthority = req.body.docAuthority;

		insertNewDocument(docName,docContain,docOwner,docIntroduction,docAuthority,function(){
			findDoc(0,function(){
				docId = global.gDocument[0].docId;
				fs.writeFile(path.join(__dirname, '../documents/prototype/'+docId+'.'+docName), docInnerText, function(err) {
					res.render('manager_index');
				});
			});
		});
	} else {
		res.render('notFriends');
	}
});



router.post('/waitToBeFriends', function(req, res, next) {
	var name = req.body.name;
	var password = req.body.password;
	var mailbox = req.body.mailbox;
	var phone = req.body.phone;
	var introduction = req.body.introduction;

	var passwordSHA1 = '';
	var hash = crypto.createHash('sha1');
	hash.on('readable', () => {
		var data = hash.read();
		if (data)
		passwordSHA1 = data.toString('hex');
	});
	hash.write(password);
	hash.end();

	insertNewAccount(name,passwordSHA1,mailbox,phone,introduction,function(){
		res.redirect('/');
	});
});



router.get('/logout', function(req, res, next) {
	global.gUser = {};
	global.gDocument = [];
	global.gDownloadHistory = [];
	global.gChooseId = 0;
	global.gChooseDoc = {};
	global.gMachine = {};
	global.gSM2 = {};
	global.gMessage = '';
	global.gCiphertext = '';
	res.render('login');
});



router.get('/', function(req, res, next) {
	res.render('login');
});


module.exports = router;
