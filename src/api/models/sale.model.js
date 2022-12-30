const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { toJSON } = require("./plugins");

const salesSchema = mongoose.Schema(
  {
    branch_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    barber_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
    },
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true,
      },
    ],
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    total_points: {
      type: String,
      default: 0
    },
    total: {
      type: String,
      default: 0
    }
  },
  {
    timestamps: true,
  }
);

salesSchema.plugin(toJSON);
salesSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Sale", salesSchema);
