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
    res.status(201).json(feature);
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
    const deleted = await Feature.findByIdAndDelete({_id: req.params.feature_id});
    if (!deleted) return res.status(404).json({ message: 'Feature topilmadi' });
    res.json({ message: 'Feature muvaffaqiyatli o‘chirildi' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a feature
exports.updateFeature = async (req, res) => {
  try {
    const featureId = req.params.feature_id;

    // Agar bodyda code mavjud bo‘lsa, takroriyligini tekshiramiz
    if (req.body.code) {
      const existing = await Feature.findOne({ code: req.body.code, _id: { $ne: featureId } });
      if (existing) {
        return res.status(400).json({ message: 'Bu code allaqachon mavjud' });
      }
    }

    const updated = await Feature.findByIdAndUpdate(featureId, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({ message: 'Feature topilmadi' });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
