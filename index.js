require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const errorMiddleware = require('./middlewares/error.middleware.js')

const app = express()

app.use(express.json())
app.use(
	cors({
		origin: ['http://127.0.0.1:5500'],
		credentials: true,
	})
)
app.use(cookieParser())

// Routes
app.use('/api/auth', require('./routes/auth.route'))

// Errors
app.use(errorMiddleware)

// Start app
const PORT = process.env.PORT || 3000
const DB_URL = process.env.DB_URL

const bootstrap = async () => {
	try {
		await mongoose.connect(DB_URL).then(() => console.log('Connected MongoDB'))
		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`)
		})
	} catch (error) {
		console.log(`Error connecting with DB - ${error}`)
	}
}
bootstrap()
