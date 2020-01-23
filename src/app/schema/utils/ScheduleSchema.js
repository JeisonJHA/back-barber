import mongoose from 'mongoose';

const ScheduleSchema = new mongoose.Schema({
  hour: {
    type: String,
    required: true,
  },
  available: {
    type: Boolean,
    required: true,
  },
});

export default ScheduleSchema;
