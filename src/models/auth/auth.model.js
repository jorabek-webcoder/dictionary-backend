const { Schema, model } = require("mongoose");
const { RoleConstands, CollectionName } = require("../../utils/constands");

const documentSchema = new Schema(
  {
    name: { type: String, default: "" },
    telephone: { type: String, require: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: [RoleConstands.ADMIN],
      default: RoleConstands.ADMIN,
    },
    dictionary: { type: Schema.Types.ObjectId, ref: CollectionName.DICTIONARY },
  },
  { timestamps: true, versionKey: false },
);

const AuthModel = model(
  CollectionName.AUTH,
  documentSchema,
  CollectionName.AUTH,
);

module.exports = { AuthModel };
