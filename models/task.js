import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  text: String,
  done: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Task= mongoose.models.Task || mongoose.model('Task', taskSchema);
export default Task;