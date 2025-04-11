module.exports = class AppDataDto {
	email;
	firstName;
	lastName;
	phone;
	kafeName;
	kafe_id;
	tarif_id;

	constructor(userData, kafeData) {
		this.email = userData?.email || null;
		this.firstName = userData?.firstName || null;
		this.lastName = userData?.lastName || null;
		this.tarif_id = 1;
		this.phone = userData?.phone?.[0] || null;
		this.kafe_id = kafeData?._id || null;
		this.kafeName = kafeData?.name || null;
	}
}
