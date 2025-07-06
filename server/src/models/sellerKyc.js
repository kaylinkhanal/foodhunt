import mongoose from 'mongoose';
const { Schema } = mongoose;

const sellerKycSchema = new Schema({
  location: String, 
  coords: {},
  panId: String,
  registrationDate: String,
  seller: { type: Schema.Types.ObjectId, ref: 'User' },
  isKycSubmitted: { type: Boolean, default: false },
  isKycApproved: { type: Boolean, default: false },
});
const SellerKyc = mongoose.model('SellerKyc', sellerKycSchema);
export default SellerKyc;