const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  platformName: {
    type: String,
    default: 'EDUCOURS',
  },
  commissionPercent: {
    type: Number,
    default: 40,
    min: 0,
    max: 100,
  },
  currency: {
    type: String,
    default: 'FCFA',
    immutable: true,
  },
  dailyChatbotLimit: {
    type: Number,
    default: 50,
    min: 1,
  },
  teacherPayoutDay: {
    type: Number,
    default: 1,
    min: 1,
    max: 28,
  },
  contactEmail: {
    type: String,
    default: 'notiofopajoel@gmail.com',
  },
  contactPhone: {
    type: String,
    default: '+237 678095581',
  },
  termsOfService: {
    type: String,
    default: '',
  },
  privacyPolicy: {
    type: String,
    default: '',
  },
  aboutUs: {
    type: String,
    default: '',
  },
  maintenanceMode: {
    type: Boolean,
    default: false,
  },
  logoUrl: {
    type: String,
    default: '',
  },
  faviconUrl: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
