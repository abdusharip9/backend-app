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
	async getUserKafes(req, res, next){
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
	async getUsers(req, res, next){
		try {
			const users = await crudService.getUsers()
			return res.json(users)
		} catch (error) {
			next(error)
		}
	}
	async allKafes(req, res, next){
		try {
			const kafes = await crudService.allKafes()
			return res.json(kafes)
		} catch (error) {
			next(error)
		}
	}
	// async getRoles(req, res, next){
	// 	try {
	// 		const roles = await crudService.getRoles()
	// 		return res.json(roles)
	// 	} catch (error) {
	// 		next(error)
	// 	}
	// }
	async getDataForDashboard(req, res, next){
		try {
			const data = await crudService.getDataForDashboard()
			return res.json(data)
		} catch (error) {
			next(error)
		}
	}
}

module.exports = new CrudController()
