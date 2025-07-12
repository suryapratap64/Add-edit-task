import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Note=mongoose.models.Note || mongoose.model('Note', noteSchema);
export default Note;