const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionPointSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  collectionPoint_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CollectionPoint",
    required: true
  },
});

const collectionPointSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
});

transactionPointSchema.set("toObject", { virtuals: true });
transactionPointSchema.set("toJSON", { virtuals: true });
transactionPointSchema.set("timestamps", {
  createdAt: "created_at",
  updatedAt: "updated_at",
});

collectionPointSchema.set("toObject", { virtuals: true });
collectionPointSchema.set("toJSON", { virtuals: true });
collectionPointSchema.set("timestamps", {
  createdAt: "created_at",
  updatedAt: "updated_at",
});

const TransactionPoint = mongoose.model(
  "TransactionPoint",
  transactionPointSchema
);

const CollectionPoint = mongoose.model(
  "CollectionPoint",
  collectionPointSchema
);

module.exports = {
  TransactionPoint,
  CollectionPoint,
};
