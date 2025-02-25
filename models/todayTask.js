const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const todayTasksSchema = new Schema({
  title: {
    type: String,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  dueDay: {
    type: Date,
  },
  description: {
    type: String,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Todo", todayTasksSchema);
