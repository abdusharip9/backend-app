const { default: mongoose } = require('mongoose')
const TransactionError = require('../errors/transaction.error')
const { PaymeError, PaymeData, TransactionState } = require('../enum/transaction.enum')


const userModel = require('../models/users.model')
const transactionModel = require('../models/transaction.model')
const tariffsModel = require('../models/tariffs.model')
const cafesModel = require('../models/cafes.model')
const subscriptionModel = require('../models/subscription.model')

class TransactionService {
	async checkPerformTransaction(params, id) {
		let { account, amount } = params

		if (!mongoose.Types.ObjectId.isValid(account.kafe_id)) {
			throw new TransactionError(PaymeError.UserNotFound, id, PaymeData.kafe_id)
		}
		if (!mongoose.Types.ObjectId.isValid(account.tariff_id)) {
			throw new TransactionError(PaymeError.ProductNotFound, id, PaymeData.tariff_id)
		}

		amount = Math.floor(amount / 100)
		const kafe = await cafesModel.findById(account.kafe_id)
		if (!kafe) {
			throw new TransactionError(PaymeError.UserNotFound, id, PaymeData.kafe_id)
		}
		const tariff = await tariffsModel.findById(account.tariff_id)
		if (!tariff) {
			throw new TransactionError(PaymeError.ProductNotFound, id, PaymeData.tariff_id)
		}

		const durations = tariff.durations;

		let price = null;
		for (const key of ['daily', 'monthly', 'yearly']) {
			const entry = durations[key];
			if (entry && typeof entry.price === 'number') {
				price = entry.price;
				break;
			}
		}

		console.log(durations);

		if (amount !== price) {
			throw new TransactionError(PaymeError.InvalidAmount, id)
		}
	}

	async checkTransaction(params, id) {
		const transaction = await transactionModel.findOne({ id: params.id })
		if (!transaction) {
			throw new TransactionError(PaymeError.TransactionNotFound, id)
		}
		return {
			create_time: transaction.create_time,
			perform_time: transaction.perform_time,
			cancel_time: transaction.cancel_time,
			transaction: transaction.id,
			state: transaction.state,
			reason: transaction.reason,
		}
	}

	async createTransaction(params, id) {
		let { account, time, amount } = params

		amount = Math.floor(amount / 100)

		await this.checkPerformTransaction(params, id)

		let transaction = await transactionModel.findOne({ id: params.id })
		if (transaction) {
			if (transaction.state !== TransactionState.Pending) {
				throw new TransactionError(PaymeError.CantDoOperation, id)
			}
			const currentTime = Date.now()
			const expirationTime = (currentTime - transaction.create_time) / 60000 < 12
			if (!expirationTime) {
				await transactionModel.findOneAndUpdate({ id: params.id }, { state: TransactionState.PendingCanceled, reason: 4 })
				throw new TransactionError(PaymeError.CantDoOperation, id)
			}
			return {
				create_time: transaction.create_time,
				transaction: transaction.id,
				state: TransactionState.Pending,
			}
		}

		transaction = await transactionModel.findOne({ kafe_id: account.kafe_id, tariff_id: account.tariff_id, provider: 'payme' })
		if (transaction) {
			if (transaction.state === TransactionState.Paid) throw new TransactionError(PaymeError.AlreadyDone, id)
			if (transaction.state === TransactionState.Pending) throw new TransactionError(PaymeError.Pending, id)
		}

		const newTransaction = await transactionModel.create({
			id: params.id,
			state: TransactionState.Pending,
			amount,
			user: account.kafe_id,
			product: account.tariff_id,
			create_time: time,
			provider: 'payme',
		})

		return {
			transaction: newTransaction.id,
			state: TransactionState.Pending,
			create_time: newTransaction.create_time,
		}
	}

	async performTransaction(params, id) {
		const currentTime = Date.now()

		const transaction = await transactionModel.findOne({ id: params.id })
		if (!transaction) {
			throw new TransactionError(PaymeError.TransactionNotFound, id)
		}
		if (transaction.state !== TransactionState.Pending) {
			if (transaction.state !== TransactionState.Paid) {
				throw new TransactionError(PaymeError.CantDoOperation, id)
			}
			return {
				perform_time: transaction.perform_time,
				transaction: transaction.id,
				state: TransactionState.Paid,
			}
		}
		const expirationTime = (currentTime - transaction.create_time) / 60000 < 12
		if (!expirationTime) {
			await transactionModel.findOneAndUpdate(
				{ id: params.id },
				{ state: TransactionState.PendingCanceled, reason: 4, cancel_time: currentTime }
			)
			throw new TransactionError(PaymeError.CantDoOperation, id)
		}

		await transactionModel.findOneAndUpdate({ id: params.id }, { state: TransactionState.Paid, perform_time: currentTime })
		const thisTariff = await tariffsModel.findById
		const newSub = await Subscription.create({
      kafe_id: params.kafe_id,
      tariff_id: params.tariff._id,
      payment_type,
      start_date: now,
      end_date: endDate,
      status: 'active'
    });

		return {
			perform_time: currentTime,
			transaction: transaction.id,
			state: TransactionState.Paid,
		}
	}

	async cancelTransaction(params, id) {
		const transaction = await transactionModel.findOne({ id: params.id })

		if (!transaction) {
			throw new TransactionError(PaymeError.TransactionNotFound, id)
		}

		const currentTime = Date.now()

		if (transaction.state > 0) {
			await transactionModel.findOneAndUpdate(
				{ id: params.id },
				{ state: -Math.abs(transaction.state), reason: params.reason, cancel_time: currentTime }
			)
		}

		return {
			cancel_time: transaction.cancel_time || currentTime,
			transaction: transaction.id,
			state: -Math.abs(transaction.state),
		}
	}

	async getStatement(params) {
		const { from, to } = params
		const transactions = await transactionModel.find({ create_time: { $gte: from, $lte: to }, provider: 'payme' })

		return transactions.map(transaction => ({
			id: transaction.id,
			time: transaction.create_time,
			amount: transaction.amount,
			account: {
				kafe_id: transaction.kafe_id,
				tariff_id: transaction.tariff_id,
			},
			create_time: transaction.create_time,
			perform_time: transaction.perform_time,
			cancel_time: transaction.cancel_time,
			transaction: transaction.id,
			state: transaction.state,
			reason: transaction.reason,
		}))
	}
}

module.exports = new TransactionService()