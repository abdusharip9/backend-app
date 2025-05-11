// updateTariffs.js
const mongoose = require('mongoose');
const Tariff = require('./models/tariffs.model'); // kerakli joyga mos yo‘l

async function updateDescriptions() {
  await Tariff.updateOne(
    { name: "Pro" },
    { $set: { description: "Katta muammolarga oddiy yechim\nRestoranning yuragi – nazorat! Buyurtma, ombor, hisobot, ofitsiantlar va bron tizimini bir joyda boshqaring. Pro bilan rivojlanishingizni avtomatlashtiring!" } }
  );

  await Tariff.updateOne(
    { name: "Enterprise" },
    { $set: { description: "Tarmoqlar uchun kuchli platforma\nBir emas, o‘nlab filiallar? Muammo emas! Enterprise sizga kuchli serverlar, maxfiylik, ERP integratsiyalar va analitikani taqdim etadi. Katta o‘ylang, katta ishlang!" } }
  );

  console.log("Descriptions updated!");
}

module.exports = async function() {
  try {
    await mongoose.connect(process.env.DB_URL);
    await updateDescriptions();
    mongoose.disconnect();
  } catch (err) {
    console.error("Error updating tariffs:", err);
  }
};
