import mongoose, { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  apellido: {
    type: String,
    required: false,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  numero: {
    type: String,
    unique: true, 
    trim: true,
    required: false,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  avatarUsuario: {
    type: String,
    trim: true,
  },
  avatarUsuarioID: {
    type: String,
    trim: true,
  },
  carrera: {
    type: String,
    enum: ['TSDS', 'TSEM', 'TSASA', 'TSPIM', 'TSPA', 'TSRT', 'NONE'],
    required: false,
  },
  token: {
    type: String,
    default: null,
  },
  rol: {
    type: String,
    enum: ['administrador', 'estudiante', 'pasante'],
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  confirmEmail: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
});

userSchema.methods.encryptPassword = async function(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

userSchema.methods.matchPassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.crearToken = function() {
  const tokenGenerado = Math.random().toString(36).slice(2);
  this.token = tokenGenerado;
  return tokenGenerado;
};

export default model('User', userSchema);
