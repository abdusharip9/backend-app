module.exports = class UserDto {
	email
	firstName
	lastName
	phone
	id
	isActivated
	adress

	constructor(user) {
		this.email = user.email
		this.firstName = user.firstName
		this.lastName = user.lastName
		this.phone = user.phone
		this.adress = user.adress
		this.id = user.id
		this.isActivated = user.isActivated
	}
}
