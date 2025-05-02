class PaymeController {
    async payme(req, res) {
        try {
					res.json({ message: 'Payme' })
				} catch (error) {
					
				}
    }

    async checkout(req, res) {
        try {
					res.json({ message: 'Checkout' })
				} catch (error) {
					
				}
    }
}

module.exports = new PaymeController()
