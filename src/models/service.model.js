import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      trim: true
    },
    duration: {
      type: Number,
      required: [true, 'La duración es obligatoria'],
      min: [1, 'La duración debe ser mayor a 0']
    },
    price: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [1, 'El precio debe ser mayor a 0']
    },
    category: {
      type: String,
      required: [true, 'La categoría es obligatoria'],
      trim: true
    },
    available: {
      type: Boolean,
      required: [true, 'La disponibilidad es obligatoria']
    }
  },
  {
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      }
    }
  }
);

const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);

export default Service;
