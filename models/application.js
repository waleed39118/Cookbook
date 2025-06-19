const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
    company: String,
  title: String,
  notes: String,
  postingLink: String,
  status: {
    type: String,
    enum: ["interested", "applied", "interviewing", "rejected", "accepted"],
    default: "interested"
  }
  },
  title: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Application", applicationSchema);
