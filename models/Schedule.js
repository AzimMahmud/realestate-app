
const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({

  name: {
    type: String,
    trim: true,
    required: [true, 'Please add a title for the review'],
    maxlength: 100
  },
  phone: {
    type: String,
    maxlength: [20, 'Phone number can not be longer than 20 characters']
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  date: {
    type: Date,
    required: [true, 'Please add a date and time']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  property: {
    type: mongoose.Schema.ObjectId,
    ref: 'Property',
    required: true
  }
});


module.exports = mongoose.model('Schedule', ScheduleSchema);