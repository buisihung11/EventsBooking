const mongooose = require("mongoose");

const Schema = mongooose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdEvents: [
    {
      //ref help mongoose create relation ship between two model
      //and will automatically merge these model data
      type: Schema.Types.ObjectId,
      ref: "Event"
    }
  ]
});

module.exports = mongooose.model("User", userSchema);
