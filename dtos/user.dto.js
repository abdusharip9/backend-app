module.exports = class UserDto {
	constructor(user) {
		this.email = user.email
		this.id = user.id
		this.isActivated = user.isActivated
	}
}
