import { Router } from "express";
import SellerKyc from "../models/sellerKyc.js";
import User from "../models/user.js";

const kycRouter = Router();

kycRouter.post("/kycs/:id", async (req, res) => {
  SellerKyc.create({
    seller: req.params.id,
    isKycSubmitted: true,
    ...req.body,
  });
  const seller = await User.findById(req.params.id);
  seller.coords = req.body.coords;
  seller.save();
  return res.send({ message: "KYC details submitted successfully" });
});

kycRouter.get("/kycs/:id", async (req, res) => {
  const kyc = await SellerKyc.findOne({ seller: req.params.id });
  if (!kyc)
    return res
      .status(404)
      .send({
        isKycApproved: false,
        isKycSubmitted: false,
        message: "KYC details not found",
      });
  return res.send({
    isKycApproved: kyc.isKycApproved,
    isKycSubmitted: kyc.isKycSubmitted,
    message: "KYC details found successfully",
  });
});

kycRouter.get("/kycs", async (req, res) => {
  let kyc;
  if (req.query.status == "pending") {
    kyc = await SellerKyc.find({ isKycApproved: false }).populate("seller");
  } else {
    kyc = await SellerKyc.find().populate("seller");
  }

  return res.json(kyc);
});

kycRouter.patch("/kycs/:id", async (req, res) => {
  const kyc = await SellerKyc.findById(req.params.id);
  console.log(kyc);
  kyc.isKycApproved = true;
  await kyc.save();
  res.json({ message: "KYC approved successfully" });
});

export default kycRouter;
