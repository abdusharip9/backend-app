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

	async sendForgotPasswordMail(email, activationLink) {
		await this.transporter.sendMail({
			from: process.env.SMTP_USER,
			to: email,
			subject: 'Parolni tiklash',
			html: `
				<h1>Parolni tiklash</h1>
				<p>Parolni tiklash uchun quyidagi linkga o'ting:</p>
				<a href="${activationLink}">Parolni tiklash havolasi</a>
			`,
		})
	}
}

module.exports = new EmailService()
