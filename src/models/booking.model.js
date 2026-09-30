import mongoose from 'mongoose';

const bookingServiceSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1
    }
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: [true, 'El nombre del cliente es obligatorio'],
      trim: true
    },
    clientEmail: {
      type: String,
      required: [true, 'El email del cliente es obligatorio'],
      trim: true
    },
    date: {
      type: String,
      required: [true, 'La fecha es obligatoria']
    },
    time: {
      type: String,
      required: [true, 'La hora es obligatoria']
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending'
    },
    services: {
      type: [bookingServiceSchema],
      default: []
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

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

export default Booking;
