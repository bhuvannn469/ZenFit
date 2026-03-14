const Workout = require('../models/Workout');

// @desc    Add a new workout
// @route   POST /api/workouts
// @access  Private
const addWorkout = async (req, res) => {
  try {
    const { title, exercises, scheduledTime, reminderEnabled } = req.body;

    if (!title || !exercises || !exercises.length) {
      return res.status(400).json({ msg: 'Title and at least one exercise are required.' });
    }

    const workout = await Workout.create({
      user: req.user._id,
      title,
      exercises,
      scheduledTime: scheduledTime ? new Date(scheduledTime) : null,
      reminderEnabled: reminderEnabled || false,
      date: scheduledTime ? new Date(scheduledTime) : new Date()
    });

    res.status(201).json(workout);
  } catch (error) {
    console.error("Add Workout Error:", error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};


// @desc    Get all workouts for a user
// @route   GET /api/workouts
// @access  Private
const getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user._id }).sort({ date: -1 });
    res.json(workouts);
  } catch (error) {
    console.error("Get Workouts Error:", error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// @desc    Update a workout
// @route   PUT /api/workouts/:id
// @access  Private
const updateWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) return res.status(404).json({ msg: 'Workout not found' });

    // Check if the workout belongs to the logged-in user
    if (workout.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const updated = await Workout.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // return updated object
    );

    res.json(updated);
  } catch (error) {
    console.error("Update Workout Error:", error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// @desc    Delete a workout
// @route   DELETE /api/workouts/:id
// @access  Private
const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) return res.status(404).json({ msg: 'Workout not found' });

    if (workout.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Workout.findByIdAndDelete(req.params.id); // ✅ FIXED LINE
    res.json({ msg: 'Workout deleted' });
  } catch (error) {
    console.error("Delete Workout Error:", error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

const getWorkoutCalendar = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user._id }).sort({ scheduledTime: 1 });
    const calendarEvents = workouts.map(w => ({
      title: w.title,
      date: w.scheduledTime || w.date,
      id: w._id
    }));
    res.json(calendarEvents);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

module.exports = {
  addWorkout,
  getWorkouts,
  updateWorkout,
  deleteWorkout,
  getWorkoutCalendar
};
