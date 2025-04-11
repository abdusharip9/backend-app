require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const errorMiddleware = require('./middlewares/error.middleware.js')

const app = express()

app.use(express.json())
const allowedOrigins = [
	'http://127.0.0.1:5500',
	'https://a1kafe-mod.netlify.app',
	'http://127.0.0.1:3000',
	'http://127.0.0.1:3001',
	'http://127.0.0.1:5173',
	'http://localhost:5500',
	// 'http://localhost:5500',
]

app.use(
	cors({
		origin: allowedOrigins,
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
	})
)
app.use(cookieParser())

// Routes
app.use('/api/auth', require('./routes/auth.route'))
app.use('/api/crud', require('./routes/crud.route.js'))
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
