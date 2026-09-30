import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: [true, 'El usuario es obligatorio'],
      trim: true
    },
    message: {
      type: String,
      required: [true, 'El mensaje es obligatorio'],
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
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

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

export default Message;
