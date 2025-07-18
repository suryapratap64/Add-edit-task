const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,          
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,    
    trim: true,
  }
}, { timestamps: true });
const User = mongoose.models.User || mongoose.model('User', userSchema);


export default User;
