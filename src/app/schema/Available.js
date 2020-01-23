import mongoose from 'mongoose';

import ScheduleSchema from './utils/ScheduleSchema';

const AvailableSchema = new mongoose.Schema(
  {
    schedule: {
      type: [ScheduleSchema],
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Available', AvailableSchema);
