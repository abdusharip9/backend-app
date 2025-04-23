const Feature = require('../models/tariffs.feature.model');

// 🔹 Yangi feature qo‘shish
exports.createFeature = async (req, res) => {
  try {
    const { code, name, description } = req.body;

    const feature = new Feature({
      code,
      name,
      description,
    });

    await feature.save();
    res.status(201).json({ message: "Feature muvaffaqiyatli qo‘shildi", feature });
  } catch (err) {
    console.error("Feature yaratishda xatolik:", err);
    res.status(500).json({ error: 'Xatolik yuz berdi' });
  }
};

// 🔹 Barcha featurelarni olish
exports.getAllFeatures = async (req, res) => {
  try {
    const features = await Feature.find();
    res.json(features);
  } catch (err) {
    console.error("Featurelarni olishda xatolik:", err);
    res.status(500).json({ error: 'Xatolik yuz berdi' });
  }

  
};

// Delete a feature
exports.deleteFeature = async (req, res) => {
  try {
    const deleted = await Feature.findByIdAndDelete(req.params.feature_id);
    if (!deleted) return res.status(404).json({ message: 'Feature topilmadi' });
    res.json({ message: 'Feature muvaffaqiyatli o‘chirildi' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a feature
exports.updateFeature = async (req, res) => {
  try {
    const updated = await Feature.findByIdAndUpdate(req.params.feature_id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Feature topilmadi' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};