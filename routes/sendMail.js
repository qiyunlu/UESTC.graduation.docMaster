var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var email = {
	service: 'QQ',
	user: '3028184231@qq.com',
	pass: 'eoidsjznhwkqdehd'
}

smtpTransport = nodemailer.createTransport(smtpTransport({
	service: email.service,
	auth: {
		user: email.user,
		pass: email.pass
	}
}));

var sendMail = function (recipient, subject, html) {

	smtpTransport.sendMail({

		from: email.user,
		to: recipient,
		subject: subject,
		html: html

	}, function (err) {
		if (err) {
			console.log(err);
		}
    });
}

module.exports = sendMail;
