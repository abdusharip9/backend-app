const { PaymeMethod } = require('../enum/transaction.enum')
const paymeService = require('../services/transaction.service')

class TransactionController {
	async payme(req, res, next) {
		try {
			const { method, params, id } = req.body

			switch (method) {
				case PaymeMethod.CheckPerformTransaction: {
					await paymeService.checkPerformTransaction(params, id)
					return res.json({ result: { allow: true } })
				}
				case PaymeMethod.CheckTransaction: {
					const result = await paymeService.checkTransaction(params, id)
					return res.json({ result, id })
				}
				case PaymeMethod.CreateTransaction: {
					const result = await paymeService.createTransaction(params, id)
					return res.json({ result, id })
				}
				case PaymeMethod.PerformTransaction: {
					const result = await paymeService.performTransaction(params, id)
					return res.json({ result, id })
				}
				case PaymeMethod.CancelTransaction: {
					const result = await paymeService.cancelTransaction(params, id)
					return res.json({ result, id })
				}
				case PaymeMethod.GetStatement: {
					const result = await paymeService.getStatement(params, id)
					return res.json({ result: { transactions: result } })
				}
			}
		} catch (err) {
			next(err)
		}
	}
	async checkout(req, res, next) {
		try {
			const { method, params, id } = req.body
		} catch (err) {
			next(err)
		}
	}
}

module.exports = new TransactionController()