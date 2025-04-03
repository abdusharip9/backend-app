const nodemailer = require('nodemailer')

class EmailService {
	constructor() {
		this.transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: parseInt(process.env.SMTP_PORT), // ✅ To‘g‘ri format
			secure: process.env.SMTP_PORT === '465', // ✅ 465 -> true, boshqa portlar false
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASSWORD,
			},
		})
	}

	async sendMail(email, verificationCode) {
		await this.transporter.sendMail({
			from: process.env.SMTP_USER,
			to: email,
			subject: 'Account Activation',
			html: `
				<h1>Activate your account</h1>
				<p>Use the code below to activate your account:</p>
				<h3>${verificationCode}</h3>
			`,
		})
	}
}

module.exports = new EmailService()
