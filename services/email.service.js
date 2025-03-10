const nodemailer = require('nodemailer')

class EmailService {
	constructor() {
		this.transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			posrt: process.env.SMTP_PORT,
			secure: false,
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASSWORD,
			},
		})
	}

	async sendMail(email, activationLink) {
		await this.transporter.sendMail({
			from: process.env.SMTP_USER,
			to: email,
			subject: 'Account Activation',
			html: `
        <h1>Activate your account</h1>
        <p>Click the link below to activate your account:</p>
        <a href="${activationLink}">${activationLink}</a>
      `,
		})
	}
}
module.exports = new EmailService()
