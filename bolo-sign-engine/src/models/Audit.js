const mongoose = require('mongoose');
const { Schema } = mongoose;

const auditSchema = new Schema({
  pdfId: { type: String },
  userId: { type: String },
  action: { type: String, default: 'sign' },
  originalHash: { type: String },
  signedHash: { type: String },
  coords: { type: Schema.Types.Mixed },
  page: { type: Number },
  signatureHash: { type: String },
  storageUrl: { type: String },
  meta: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Audit', auditSchema);