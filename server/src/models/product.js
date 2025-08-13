import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    // Basic Product Information
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 500,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    imageName: {
      type: String,
   
    },

    //seller info
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Pricing and Discount Details
    originalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    discountedPrice: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        // Discounted price must be less than or equal to original price
        validator: function (v) {
          return v <= this.originalPrice;
        },
        message:
          "Discounted price must be less than or equal to the original price.",
      },
    },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
      //  might  calculate this on the frontend
      // For now, it's a direct field.
    },

    // Expiration and Availability
    expiryDate: {
      type: Date,
    },
    availableQuantity: {
      type: Number,
      required: true,
      min: 0, // Quantity cannot be negative
      default: 1,
    },
    isAvailable: {
      type: Boolean,
      default: true, // Automatically set to false if quantity drops to 0 or expiryDate passes
    },
    emoji: {
      type: String,
    },
    // Product Status and Timestamps
    status: {
      type: String,
      enum: ["active", "sold-out", "expired", "draft", "unavailable"],
      default: "active",
    },
  },

  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Middleware to update isAvailable and status based on quantity and expiryDate
// productSchema.pre("save", function (next) {
//   if (this.isModified("availableQuantity") || this.isModified("expiryDate")) {
//     if (this.availableQuantity <= 0) {
//       this.isAvailable = false;
//       this.status = "sold-out";
//     } else if (this.expiryDate && this.expiryDate <= new Date()) {
//       this.isAvailable = false;
//       this.status = "expired";
//     } else {
//       // Only set to active/true if it was previously sold-out or expired
//       if (this.status === "sold-out" || this.status === "expired") {
//         this.status = "active";
//         this.isAvailable = true;
//       }
//     }
//   }
//   next();
// });

const Product = mongoose.model("Product", productSchema);

export default Product;
