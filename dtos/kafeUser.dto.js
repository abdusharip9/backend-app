module.exports = class KafeUserDto {
	username
	password

	constructor(kafeUserData) {
		this.username = kafeUserData.username
		this.password = kafeUserData.password
	}
}
