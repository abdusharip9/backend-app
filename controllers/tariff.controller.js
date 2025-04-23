const Tariff = require('../models/tariffs.model');
const Subscription = require('../models/subscription.model');
const Payment = require('../models/payment.model');

const createTariff = async (req, res) => {
  try {
    const { name, durations, is_free_trial, features } = req.body;

    // Simple validatsiya
    if (!name) return res.status(400).json({ message: "Tarif nomi kerak" });
    if (!durations || Object.keys(durations).length === 0)
      return res.status(400).json({ message: "Hech bo'lmaganda bitta duration kiriting (daily/monthly/yearly)" });

    const newTariff = new Tariff({
      name,
      durations,
      is_free_trial: is_free_trial || false,
      features
    });

    await newTariff.save();

    return res.status(201).json({
      message: "Tarif muvaffaqiyatli yaratildi",
      tariff: newTariff
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server xatosi" });
  }
};

const getAllTariffs = async (req, res) => {
  try {
    const tariffs = await Tariff.find().populate('features');
    res.json(tariffs);
  } catch (error) {
    console.error('Tariflarni olishda xatolik:', error);
    res.status(500).json({ error: 'Tariflarni olib bo\'lmadi' });
  }
};

// Delete a feature
const deleteTariff = async (req, res) => {
  try {
    const deleted = await Tariff.findByIdAndDelete(req.params.tarif_id);
    if (!deleted) return res.status(404).json({ message: 'Tarif topilmadi' });
    res.json({ message: 'Tarif muvaffaqiyatli o\'chirildi' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a tariff
const updateTariff = async (req, res) => {
  try {
    const updated = await Tariff.findByIdAndUpdate(req.params.tarif_id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Tarif topilmadi' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const checkFreeTrial = async (req, res) => {
  try {
    const freeTariff = await Tariff.findOne({ is_free_trial: true });
    if (!freeTariff) {
      return res.status(404).json({ message: "Free trial tarif topilmadi" });
    }

    return res.status(200).json({
      message: "Free trial mavjud",
      tariff: freeTariff
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server xatosi" });
  }
};

const selectTariff = async (req, res) => {
  try {
    const userId = req.user.id;
    const { tariff_id, payment_type } = req.body;

    // Check if this is a free trial tariff
    const tariff = await Tariff.findById(tariff_id);
    if (!tariff) return res.status(404).json({ message: "Tarif topilmadi" });
    if (!tariff.is_free_trial) {
      return res.status(400).json({ message: "Faqat bepul sinov tarifi tanlanishi mumkin" });
    }

    // Check if user already has a free trial subscription
    const existingFreeTrial = await Subscription.findOne({
      user_id: userId,
      tariff_id: tariff._id,
      status: { $in: ['active', 'expired'] }
    });

    if (existingFreeTrial) {
      return res.status(400).json({ message: "Siz allaqachon bepul sinov tarifidan foydalangansiz" });
    }

    if (!['daily', 'monthly', 'yearly'].includes(payment_type)) {
      return res.status(400).json({ message: "Noto'g'ri payment_type" });
    }

    const selectedPlan = tariff.durations[payment_type];
    if (!selectedPlan || !selectedPlan.duration) {
      return res.status(400).json({ message: `${payment_type} rejasi mavjud emas` });
    }

    const now = new Date();
    const endDate = new Date(now);

    if (payment_type === 'daily') endDate.setDate(now.getDate() + selectedPlan.duration);
    else if (payment_type === 'monthly') endDate.setMonth(now.getMonth() + selectedPlan.duration);
    else if (payment_type === 'yearly') endDate.setFullYear(now.getFullYear() + selectedPlan.duration);

    const newSub = await Subscription.create({
      user_id: userId,
      tariff_id: tariff._id,
      payment_type,
      start_date: now,
      end_date: endDate,
      status: 'active'
    });

    return res.status(201).json({ message: "Bepul sinov tarifi tanlandi", subscription: newSub });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server xatosi" });
  }
};

const checkUserTariff = async (req, res) => {
  try {
    const userId = req.user.id;

    // Eng so'nggi aktiv subscriptionni topamiz
    const subscription = await Subscription.findOne({
      user_id: userId,
      status: 'active'
    }).populate('tariff_id');

    if (!subscription) {
      return res.status(404).json({ message: 'Aktiv tarif topilmadi' });
    }

    const now = new Date();

    // Agar tarif muddati tugagan bo'lsa
    if (subscription.end_date && now > subscription.end_date) {
      subscription.status = 'expired';
      await subscription.save();

      return res.status(200).json({
        message: 'Tarif muddati tugagan',
        expired: true
      });
    }

    return res.status(200).json({
      message: 'Aktiv tarif mavjud',
      subscription
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server xatosi' });
  }
};

module.exports = {
  createTariff, 
	getAllTariffs,
  deleteTariff,
  updateTariff,
  checkFreeTrial,
  selectTariff,
  checkUserTariff
};
