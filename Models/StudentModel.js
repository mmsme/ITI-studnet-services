let mongoose = require("mongoose");

let studentSchema = new mongoose.Schema({
  _id: Number,
  Name: String,
  Email: String,
  Department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Departments",
  },
});

//mapping
mongoose.model("Students", studentSchema);
