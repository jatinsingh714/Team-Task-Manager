import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    rating: {
      type: Number,
      default: 0
    },
    handedness: {
      type: String,
      enum: ['left', 'right'],
      default: 'right'
    }
  },
  {
    timestamps: true
  }
);

const Player = mongoose.model('Player', playerSchema);

export default Player;
