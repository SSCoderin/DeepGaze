import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  task_title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  task_content: {
    type: Array,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const Task = mongoose.models.tasks || mongoose.model("tasks", taskSchema);
export default Task;
