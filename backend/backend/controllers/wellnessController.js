const { Sleep, Mood, Meditation } = require('../models/Wellness');

// Sleep Controller Methods
exports.getSleepEntries = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const sleepEntries = await Sleep.find({ user: userId })
      .sort({ date: -1 });
    
    res.json(sleepEntries);
  } catch (error) {
    console.error('Error fetching sleep entries:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSleepEntry = async (req, res) => {
  try {
    const { date } = req.params;
    const userId = req.user.id;
    
    const queryDate = new Date(date);
    
    const sleepEntry = await Sleep.findOne({
      user: userId,
      date: {
        $gte: new Date(queryDate.setHours(0, 0, 0, 0)),
        $lt: new Date(queryDate.setHours(23, 59, 59, 999))
      }
    });
    
    if (!sleepEntry) {
      return res.status(404).json({ message: 'Sleep entry not found' });
    }
    
    res.json(sleepEntry);
  } catch (error) {
    console.error('Error fetching sleep entry:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createSleepEntry = async (req, res) => {
  try {
    const userId = req.user.id;
    const sleepData = req.body;
    
    const date = new Date(sleepData.date);
    
    // Check for existing entry on the same date
    const existingEntry = await Sleep.findOne({
      user: userId,
      date: {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999))
      }
    });
    
    if (existingEntry) {
      return res.status(400).json({ message: 'Sleep entry already exists for this date' });
    }
    
    const sleepEntry = await Sleep.create({
      user: userId,
      date: date,
      hoursSlept: sleepData.hoursSlept,
      quality: sleepData.quality,
      notes: sleepData.notes
    });
    
    res.status(201).json(sleepEntry);
  } catch (error) {
    console.error('Error creating sleep entry:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateSleepEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updateData = req.body;
    
    const sleepEntry = await Sleep.findOne({ _id: id, user: userId });
    
    if (!sleepEntry) {
      return res.status(404).json({ message: 'Sleep entry not found' });
    }
    
    // Update fields
    if (updateData.hoursSlept !== undefined) sleepEntry.hoursSlept = updateData.hoursSlept;
    if (updateData.quality !== undefined) sleepEntry.quality = updateData.quality;
    if (updateData.notes !== undefined) sleepEntry.notes = updateData.notes;
    
    await sleepEntry.save();
    
    res.json(sleepEntry);
  } catch (error) {
    console.error('Error updating sleep entry:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteSleepEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const sleepEntry = await Sleep.findOne({ _id: id, user: userId });
    
    if (!sleepEntry) {
      return res.status(404).json({ message: 'Sleep entry not found' });
    }
    
    await Sleep.deleteOne({ _id: id });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting sleep entry:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mood Controller Methods
exports.getMoodEntries = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const moodEntries = await Mood.find({ user: userId })
      .sort({ date: -1 });
    
    res.json(moodEntries);
  } catch (error) {
    console.error('Error fetching mood entries:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMoodEntry = async (req, res) => {
  try {
    const { date } = req.params;
    const userId = req.user.id;
    
    const queryDate = new Date(date);
    
    const moodEntry = await Mood.findOne({
      user: userId,
      date: {
        $gte: new Date(queryDate.setHours(0, 0, 0, 0)),
        $lt: new Date(queryDate.setHours(23, 59, 59, 999))
      }
    });
    
    if (!moodEntry) {
      return res.status(404).json({ message: 'Mood entry not found' });
    }
    
    res.json(moodEntry);
  } catch (error) {
    console.error('Error fetching mood entry:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createMoodEntry = async (req, res) => {
  try {
    const userId = req.user.id;
    const moodData = req.body;
    
    const date = new Date(moodData.date);
    
    // Check for existing entry on the same date
    const existingEntry = await Mood.findOne({
      user: userId,
      date: {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999))
      }
    });
    
    if (existingEntry) {
      return res.status(400).json({ message: 'Mood entry already exists for this date' });
    }
    
    const moodEntry = await Mood.create({
      user: userId,
      date: date,
      moodRating: moodData.moodRating,
      energyLevel: moodData.energyLevel,
      stressLevel: moodData.stressLevel,
      notes: moodData.notes
    });
    
    res.status(201).json(moodEntry);
  } catch (error) {
    console.error('Error creating mood entry:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateMoodEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updateData = req.body;
    
    const moodEntry = await Mood.findOne({ _id: id, user: userId });
    
    if (!moodEntry) {
      return res.status(404).json({ message: 'Mood entry not found' });
    }
    
    // Update fields
    if (updateData.moodRating !== undefined) moodEntry.moodRating = updateData.moodRating;
    if (updateData.energyLevel !== undefined) moodEntry.energyLevel = updateData.energyLevel;
    if (updateData.stressLevel !== undefined) moodEntry.stressLevel = updateData.stressLevel;
    if (updateData.notes !== undefined) moodEntry.notes = updateData.notes;
    
    await moodEntry.save();
    
    res.json(moodEntry);
  } catch (error) {
    console.error('Error updating mood entry:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteMoodEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const moodEntry = await Mood.findOne({ _id: id, user: userId });
    
    if (!moodEntry) {
      return res.status(404).json({ message: 'Mood entry not found' });
    }
    
    await Mood.deleteOne({ _id: id });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting mood entry:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Meditation Controller Methods
exports.getMeditationSessions = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const meditationSessions = await Meditation.find({ user: userId })
      .sort({ date: -1 });
    
    res.json(meditationSessions);
  } catch (error) {
    console.error('Error fetching meditation sessions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMeditationSession = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const meditationSession = await Meditation.findOne({ _id: id, user: userId });
    
    if (!meditationSession) {
      return res.status(404).json({ message: 'Meditation session not found' });
    }
    
    res.json(meditationSession);
  } catch (error) {
    console.error('Error fetching meditation session:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createMeditationSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const meditationData = req.body;
    
    const meditationSession = await Meditation.create({
      user: userId,
      date: new Date(meditationData.date),
      duration: meditationData.duration,
      type: meditationData.type,
      notes: meditationData.notes
    });
    
    res.status(201).json(meditationSession);
  } catch (error) {
    console.error('Error creating meditation session:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateMeditationSession = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updateData = req.body;
    
    const meditationSession = await Meditation.findOne({ _id: id, user: userId });
    
    if (!meditationSession) {
      return res.status(404).json({ message: 'Meditation session not found' });
    }
    
    // Update fields
    if (updateData.duration !== undefined) meditationSession.duration = updateData.duration;
    if (updateData.type !== undefined) meditationSession.type = updateData.type;
    if (updateData.notes !== undefined) meditationSession.notes = updateData.notes;
    
    await meditationSession.save();
    
    res.json(meditationSession);
  } catch (error) {
    console.error('Error updating meditation session:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteMeditationSession = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const meditationSession = await Meditation.findOne({ _id: id, user: userId });
    
    if (!meditationSession) {
      return res.status(404).json({ message: 'Meditation session not found' });
    }
    
    await Meditation.deleteOne({ _id: id });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting meditation session:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Summary method
exports.getWellnessSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.user.id;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Find all wellness entries in date range
    const sleepEntries = await Sleep.find({
      user: userId,
      date: {
        $gte: start,
        $lte: end
      }
    });
    
    const moodEntries = await Mood.find({
      user: userId,
      date: {
        $gte: start,
        $lte: end
      }
    });
    
    const meditationSessions = await Meditation.find({
      user: userId,
      date: {
        $gte: start,
        $lte: end
      }
    });
    
    // Calculate summary
    const totalSleep = sleepEntries.reduce((sum, entry) => sum + entry.hoursSlept, 0);
    const averageSleep = sleepEntries.length ? totalSleep / sleepEntries.length : 0;
    const averageSleepQuality = sleepEntries.length ? 
      sleepEntries.reduce((sum, entry) => sum + entry.quality, 0) / sleepEntries.length : 0;
    
    const averageMood = moodEntries.length ?
      moodEntries.reduce((sum, entry) => sum + entry.moodRating, 0) / moodEntries.length : 0;
    const averageEnergy = moodEntries.length ?
      moodEntries.reduce((sum, entry) => sum + entry.energyLevel, 0) / moodEntries.length : 0;
    const averageStress = moodEntries.length ?
      moodEntries.reduce((sum, entry) => sum + entry.stressLevel, 0) / moodEntries.length : 0;
    
    const totalMeditationMinutes = meditationSessions.reduce((sum, session) => sum + session.duration, 0);
    const meditationSessions7Days = meditationSessions.length;
    
    const summary = {
      sleep: {
        averageDuration: averageSleep.toFixed(1),
        averageQuality: averageSleepQuality.toFixed(1),
        totalHours: totalSleep.toFixed(1),
        entriesCount: sleepEntries.length
      },
      mood: {
        averageMood: averageMood.toFixed(1),
        averageEnergy: averageEnergy.toFixed(1),
        averageStress: averageStress.toFixed(1),
        entriesCount: moodEntries.length
      },
      meditation: {
        totalMinutes: totalMeditationMinutes,
        sessionsCount: meditationSessions7Days,
        averageSessionLength: meditationSessions7Days ? 
          (totalMeditationMinutes / meditationSessions7Days).toFixed(1) : '0'
      }
    };
    
    res.json(summary);
  } catch (error) {
    console.error('Error getting wellness summary:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
