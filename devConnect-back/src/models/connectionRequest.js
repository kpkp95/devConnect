const mongoose = require("mongoose");

const connectionRequestSchema = mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["ignored", "accepted", "rejected", "interested"],
        message: `{VALUE} is not a valid status`,
      },
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

// connectionRequestSchema.pre("save", function (next) {
//   const connectionRequest = this;
//   if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
//     return next(new Error("You cannot send a request to yourself"));
//   }
//   next();
// });

const ConnectionRequestModel = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema,
);

module.exports = ConnectionRequestModel;
