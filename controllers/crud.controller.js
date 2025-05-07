const crudService = require('../services/crud.service')

class CrudController {
	async getUser(req, res, next) {
		try {
			const { id } = req.params
			const userData = await crudService.getUser(id)
			return res.json(userData)
		} catch (error) {
			next(error)
		}
	}

	async getKafes(req, res, next){
		try {
			const { adminId } = req.params
			const kafes = await crudService.getKafes(adminId)
			return res.json(kafes)
		} catch (error) {
			next(error)
		}
	}

	async updateUser(req, res, next) {
		try {
			const { body, params } = req
			await crudService.updateUser(body, params.id)
			return res.json({ message: 'Malumolar yangilandi' })
		} catch (error) {
			next(error)
		}
	}

	async addKafe(req, res, next) {
		try {
			const { body, params } = req
			const newData = await crudService.addKafe(body, params.id)
			return res.json({ newData })
		} catch (error) {
			next(error)
		}
	}
	async deleteKafe(req, res, next) {
		try {
			const { body, params } = req

			const newData = await crudService.deleteKafe(body, params.id)
			return res.json({ newData })
		} catch (error) {
			next(error)
		}
	}

	async addPhone(req, res, next) {
		try {
			const { body, params } = req
			const newData = await crudService.addPhone(body, params.id)
			return res.json({ newData })
		} catch (error) {
			next(error)
		}
	}
	async deletePhone(req, res, next) {
		try {
			const { body, params } = req
			const newData = await crudService.deletePhone(body, params.id)
			return res.json({ newData })
		} catch (error) {
			next(error)
		}
	}

	async getKafeUsers(req, res, next){
		try {
			const { kafeId } = req.params
			const kafeUsers = await crudService.getKafeUsers(kafeId)
			return res.json( kafeUsers )
		} catch (error) {
			next(error)
		}
	}

	async addKafeUser(req, res, next){
		try {
			const { body, params } = req
			const kafeUserData = await crudService.addKafeUser(body, params.adminId, params.kafeId)
			return res.json(kafeUserData)
		} catch (error) {
			if (error.code === 11000) {
				res.status(409).json({ error: "Bunday foydalanuvchi allaqachon mavjud" });
			} else {
				next(error)
			}
		}
	}

	async getKafeUserData(req, res, next){
		try {
			const { adminId, kafeId } = req.params
			const kafeUserData = await crudService.getKafeUserData(adminId, kafeId)
			return res.json(kafeUserData)
		} catch (error) {
			next(error)
		}
	}

	async getUsers(req, res, next){
		try {
			const users = await crudService.getUsers()
			return res.json(users)
		} catch (error) {
			next(error)
		}
	}
}

module.exports = new CrudController()
