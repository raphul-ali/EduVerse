const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  completedLectures: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lecture'
  }],
  percentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

// Calculate percentage when completedLectures changes
progressSchema.pre('save', function(next) {
  if (this.isModified('completedLectures')) {
    const totalLectures = this.course.lectures.length;
    const completedCount = this.completedLectures.length;
    this.percentage = totalLectures > 0 ? (completedCount / totalLectures) * 100 : 0;
  }
  next();
});

const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress; 