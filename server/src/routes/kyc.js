import { Router } from "express"
import SellerKyc from "../models/sellerKyc.js"

const kycRouter = Router()

kycRouter.post('/kycs/:id', async (req, res) => {
    SellerKyc.create({seller:req.params.id, isKycSubmitted: true, ...req.body})
    return res.send({message: 'KYC details submitted successfully'})
  })

  kycRouter.get('/kycs/:id', async (req, res) => {
    const kyc = await SellerKyc.findOne({seller: req.params.id})
    if(!kyc) return res.status(404).send({isKycApproved: false, isKycSubmitted:false, message: 'KYC details not found'})
    return res.send({isKycApproved: kyc.isKycApproved, isKycSubmitted: kyc.isKycSubmitted, message: 'KYC details found successfully'})
  })


  kycRouter.patch('/kycs/:id', async (req, res) => {
 
  })

export default kycRouter