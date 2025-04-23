module.exports = class UserDto {
	email
	firstName
	lastName
	phone
	adress
	kafeName
	id
	isActivated

	constructor(user, kafeName) {
		this.email = user.email
		this.firstName = user.firstName
		this.lastName = user.lastName
		this.phone = user.phone
		this.adress = user.adress
		this.kafeName = kafeName
		this.id = user.id
		this.isActivated = user.isActivated
		this.password = user.password
	}
}
