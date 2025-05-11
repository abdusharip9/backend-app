const UserDto = require('../dtos/user.dto')
const BaseError = require('../errors/base.error')
const kafeModel = require('../models/cafes.model')
const usersModel = require('../models/users.model')
const { Types } = require('mongoose');

class CrudService{

	async getUser(id) {
		if (!id) {
			throw new Error('Id not found!')
		}

		const user = await usersModel.findById(id)
		const userKafe = await kafeModel.find({owner: id})
		// const kafeNames = userKafe[0]?.kafes || '';
		console.log(userKafe);

		
		let userDto = null
		if (userKafe && (userKafe || '')) {
			userDto = new UserDto(user, userKafe)
		} else userDto = new UserDto(user)
		return { userDto }
	}

	async updateUser(post, id) {
		if (!id) {
			throw new Error('Id not found!')
		}

		const user = await usersModel.findByIdAndUpdate(
			id,
			{
				$set: post,
			},
			{ new: true }
		)

		const userDto = new UserDto(user)

		return { user: userDto }
	}

	async getKafes(adminId){
		if (!adminId) {
			throw new Error('Id not found!')
		}

		const userKafe = await kafeModel.find({owner: adminId})
		if(!userKafe){
			throw BaseError.BadRequest(`Kafelar mavjud emas`)
		}
		// const kafesData = userKafe.kafes

		return userKafe
	}
	async addKafe(post, id) {
		if (!id) {
			throw new Error('Id not found!')
		}

		const newKafeName = post.kafeName
		if (!newKafeName) {
			throw new Error('Kafe nomi bo‘sh bo‘lishi mumkin emas')
		}

		const existKafe = await kafeModel.findOne({
			owner: id,
			name: newKafeName
		});

		if (existKafe) {
			throw BaseError.BadRequest(`${newKafeName} nom oldindan mavjud`)
		}

		const kafes = await kafeModel.create({
			name: newKafeName,
			owner: id,
		});

		const user = await usersModel.findByIdAndUpdate(id, {
			$push: { cafes: kafes._id }
		});
		console.log('user => ', user);

		return {
			kafes,
			message: 'Malumotlar yangilandi',
		}
	}
	async deleteKafe(post, id) {
		if (!id) {
			throw new Error('Id not found!')
		}

		const kafeName = await kafeModel.findOneAndDelete(
			{ owner: id },
			{_id: post.id}
		);

		return {
			message: `${kafeName.name} - Olib tashlandi`,
		}
	}

	async getUsers() {
		const users = await usersModel
			.find()
			.populate({
				path: 'cafes',
				populate: [
					{ path: 'tariff' }
				]
			});
		return users;
	}

	async allKafes() {
		const kafes = await kafeModel.find().populate('owner', 'firstName lastName email').populate('tariff', 'name price')
		return kafes
	}

}

module.exports = new CrudService()