const Tariff = require('../models/tariffs.model');
const Subscription = require('../models/subscription.model');

const createSubscription = async (req, res) => {
  try {
    const { kafe_id, tariff_id, payment_type } = req.body;

    const tariff = await Tariff.findById(tariff_id);
    if (!tariff) return res.status(404).json({ message: "Tariff topilmadi" });

    let startDate = new Date();
    let endDate;
    let price;

    if (payment_type === 'monthly') {
      endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
      price = tariff.monthly_price;
    } else if (payment_type === 'yearly') {
      endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + 1);
      price = tariff.yearly_price;
    } else {
      return res.status(400).json({ message: "To'lov turi noto'g'ri" });
    }

    const subscription = new Subscription({
      kafe_id,
      tariff_id,
      payment_type,
      start_date: startDate,
      end_date: endDate,
    });

    await subscription.save();

    res.status(201).json({
      message: "Obuna muvaffaqiyatli yaratildi",
      price: price, // bu foydalanuvchiga ko‘rsatiladigan narx
      start_date: startDate,
      end_date: endDate,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server xatosi" });
  }
};

module.exports = { createSubscription };
