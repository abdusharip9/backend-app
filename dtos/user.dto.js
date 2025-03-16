module.exports = class UserDto {
	email
	firstName
	lastName
	phone
	adress
	kafeName
	id
	isActivated

	constructor(user) {
		this.email = user.email
		this.firstName = user.firstName
		this.lastName = user.lastName
		this.phone = user.phone
		this.adress = user.adress
		this.kafeName = user.kafeName
		this.id = user.id
		this.isActivated = user.isActivated
	}
}
