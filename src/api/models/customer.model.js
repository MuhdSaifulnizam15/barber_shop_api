const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { toJSON } = require("./plugins");

const customerSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    phone_no: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

customerSchema.plugin(toJSON);
customerSchema.plugin(mongoosePaginate);

customerSchema.statics.isPhoneNumberTaken = async function (
  phone_no,
  excludeCustomerId
) {
  const customer = await this.findOne({
    phone_no,
    _id: { $ne: excludeCustomerId },
  });
  return !!customer;
};

module.exports = mongoose.model("Customer", customerSchema);
