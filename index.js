require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const path = require('path')
const errorMiddleware = require('./middlewares/error.middleware.js')

const app = express()

app.use(express.json())
const allowedOrigins = [
	'http://127.0.0.1:5500',
	'http://127.0.0.1:5501',
	'https://a1kafe-mod.netlify.app',
	'http://127.0.0.1:3000',
	'http://localhost:3000',
	'http://127.0.0.1:3001',
	'http://127.0.0.1:5173',
	'http://localhost:5500',
	'http://172.20.169.105',
	'http://192.168.28.188:8081',
]

app.use(
	cors({
		origin: allowedOrigins,
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
	})
)
app.use(cookieParser())

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')))

// Routes
app.use('/api/admin', require('./routes/admin.route'))
app.use('/api/auth', require('./routes/auth.route'))
app.use('/api/crud', require('./routes/crud.route'))
app.use('/api/tariffs', require('./routes/tariff.route'))
app.use('/api/features', require('./routes/feature.route.js'))
app.use('/proxy', require('./routes/login.route'))
app.use('/payme', require('./routes/payme.route.js'))

app.use('/api/update-tariffs', require('./run.script'))

// Catch-all route to serve index.html for client-side routing
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../frontend/index.html'))
})

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
