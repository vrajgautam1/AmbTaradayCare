const Event = require("../models/Event");
const fs = require("fs");

// ✅ Create Event
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!image) return res.status(400).json({ error: "Image is required" });

    const event = new Event({ title, description, date, image });
    await event.save();
    res.status(201).json({ message: "Event created", event });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ View All Events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Upcoming Events - basically when the admin wants to see if there's any upcoming events they want to see. 
exports.getUpcomingEvents = async (req, res) => {
  try {
    const events = await Event.find({ date: { $gte: new Date() }, isApproved: true });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Past Events
exports.getPastEvents = async (req, res) => {
  try {
    const events = await Event.find({ date: { $lt: new Date() }, isApproved: true });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Approve Event
exports.approveEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    res.status(200).json({ message: "Event approved", event });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Remove Event
exports.removeEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, { isApproved: false }, { new: true });
    res.status(200).json({ message: "Event removed from public view", event });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Delete Event
exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Edit Event (including optional new image)

const path = require("path");

// ✅ Edit Event (including optional new image with deletion of old one)
exports.editEvent = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const eventId = req.params.id;

    const existingEvent = await Event.findById(eventId);
    if (!existingEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Prepare update data
    const updateData = { title, description, date };

    // If new image uploaded
    if (req.file) {
      // Delete old image from filesystem
      const oldImagePath = path.join(__dirname, "../uploads", existingEvent.image);
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error("Error deleting old image:", err);
        }
      });

      updateData.image = req.file.filename;
    }

    const updatedEvent = await Event.findByIdAndUpdate(eventId, updateData, { new: true });

    res.status(200).json({ message: "Event updated successfully", event: updatedEvent });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

