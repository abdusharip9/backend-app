const AppDataDto = require('../dtos/app.data.dto')
const UserDto = require('../dtos/user.dto')
const BaseError = require('../errors/base.error')
const kafeModel = require('../models/kafe.model')
const kafeUserModel = require('../models/kafeUser.model')
const usersModel = require('../models/users.model')
const { Types } = require('mongoose');

class CrudService{

	async getUser(id) {
		if (!id) {
			throw new Error('Id not found!')
		}

		const user = await usersModel.findById(id)
		const userKafe = await kafeModel.find({adminId: id})
		const kafeNames = userKafe[0]?.kafes?.map(kafes => kafes.name) || '';
		console.log(kafeNames);

		
		let userDto = null
		if (userKafe && (userKafe[0]?.kafes || '')) {
			userDto = new UserDto(user, kafeNames)
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

	async addKafe(post, id) {
		if (!id) {
			throw new Error('Id not found!')
		}

		const newKafeName = post.kafeName
		if (!newKafeName) {
			throw new Error('Kafe nomi bo‘sh bo‘lishi mumkin emas')
		}

		const existKafe = await kafeModel.findOne({
			adminId: id,
			kafes: { $elemMatch: { name: newKafeName } }
		});

		if (existKafe) {
			throw BaseError.BadRequest(`${newKafeName} nom oldindan mavjud`)
		}

		const updatedKafe = await kafeModel.findOneAndUpdate(
			{ adminId: id },
			{
				$addToSet: {
					kafes: {
						_id: new Types.ObjectId(),
						name: newKafeName
					}
				}
			},
			{ new: true, upsert: true }
		);

		const kafeNames = updatedKafe.kafes.map(kafes => kafes.name);

		return {
			kafes: kafeNames,
			message: 'Malumotlar yangilandi',
		}
	}

	async deleteKafe(post, id) {
		if (!id) {
			throw new Error('Id not found!')
		}

		const changedUserData = await kafeModel.findOneAndUpdate(
			{ adminId: id },
			{ $pull: { kafes: { name: post.kafeName } } },
			{ new: true }
		);

		if (!changedUserData) {
			throw BaseError.BadRequest(`${post.kafeName} topilmadi`)
		}

		const kafeNames = changedUserData.kafes.map(kafes => kafes.name);

		return {
			kafes: kafeNames,
			message: `${post.kafeName} - Olib tashlandi`,
		}
	}

	async addPhone(post, id) {
		if (!id) {
			throw new Error('Id not found!')
		}

		const newPhone = post.phone
		if (!newPhone) {
			throw new Error('Telefon raqami bo‘sh bo‘lishi mumkin emas')
		}

		const existPhone = await usersModel.findOne({ phone: newPhone })

		if (existPhone) {
			throw BaseError.BadRequest(`${newPhone} raqam oldindan mavjud`)
		}

		const updatedUser = await usersModel.findOneAndUpdate(
			{ _id: id },
			{ $addToSet: { phone: newPhone } },
			{ new: true, upsert: true }
		)

		return {
			phones: updatedUser.phone,
			message: 'Ma’lumotlar yangilandi',
		}
	}

	async deletePhone(post, id) {
		if (!id) {
			throw new Error('Id not found!')
		}

		const newPhone = post.phone
		if (!newPhone) {
			throw new Error('Telefon raqami bo‘sh bo‘lishi mumkin emas')
		}

		const updatedUser = await usersModel.findByIdAndUpdate(
			{ _id: id },
			{ $pull: { phone: newPhone } },
			{ new: true, upsert: true }
		)

		if (!updatedUser) {
			throw BaseError.BadRequest(`${post.phone} topilmadi`)
		}

		return {
			phones: updatedUser.phone,
			message: `${post.phone} - Olib tashlandi`,
		}
	}

	async getKafes(adminId){
		if (!adminId) {
			throw new Error('Id not found!')
		}

		const userKafe = await kafeModel.findOne({adminId: adminId})
		if(!userKafe){
			throw BaseError.BadRequest(`Kafelar mavjud emas`)
		}
		const kafesData = userKafe.kafes

		return kafesData
	}

	async addKafeUser(post, adminId, kafeId){
		if (!adminId || !kafeId || !post) {
			throw BaseError.BadRequest(`Malumotlar to'liq emas`)
		}

		const { username, password } = post;
		const kafeUser = new kafeUserModel({ kafeId, username, password})

		await kafeUser.save()

		return {message: "Foydalanuvchi qo'shildi", username, password}
	}

	async getKafeUsers(kafeId){
		const kafeUsers = await kafeUserModel.find({kafeId})

		const result = kafeUsers.map(user => ({
      username: user.username,
      password: user.password
    }));
		
		console.log(result);
		return result
	}

	async getKafeUserData(adminId, kafeId) {
		const userData = await usersModel.findById({_id:adminId});
		if (!userData) {
			throw new Error('Foydalanuvchi topilmadi!');
		}
	
		const userKafeData = await kafeModel.findOne({
			adminId,
			"kafes._id": kafeId
		});
	
		if (!userKafeData) {
			throw new Error('Kafe maʼlumoti topilmadi!');
		}
	
		const targetKafe = userKafeData.kafes.find(kafe => String(kafe._id) === String(kafeId));
	
		if (!targetKafe) {
			throw new Error('Kafe ID bazada yo‘q!');
		}
	
		const data = new AppDataDto(userData, targetKafe);
	
		console.log(userData, targetKafe);
		return { data };
	}
	

}

module.exports = new CrudService()