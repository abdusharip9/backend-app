const userModel = require('../models/users.model');
const BaseError = require('../errors/base.error')

module.exports = async function (req, res, next) {
  try {
    const userId = req.user.id;
    
    const user = await userModel.findById(userId);
    console.log(userId, user);

    if (!user || user.role !== 'admin') {
			throw BaseError.BadRequest(`Faqat Admin uchun ruxsat bor`)
    }

    next();
  } catch (err) {
    return res.status(500).json({ message: 'Xatolik', error: err.message });
  }
};
