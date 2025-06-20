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
    return res.redirect("/admin/allevents");
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ View All Events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.render("admin/pages/events", { events });
  } catch (err) {
    res.status(500).send("Could not load events.");
  }
};

// ✅ Get Upcoming Events - basically when the admin wants to see if there's any upcoming events they want to see.
exports.getUpcomingEvents = async (req, res) => {
  try {
    const events = await Event.find({
      date: { $gte: new Date() },
      isApproved: true,
    });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Past Events
exports.getPastEvents = async (req, res) => {
  try {
    const events = await Event.find({
      date: { $lt: new Date() },
      isApproved: true,
    });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Approve Event
exports.approveEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    return res.redirect("/admin/allevents");
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Remove Event
exports.removeEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { isApproved: false },
      { new: true }
    );
    return res.redirect("/admin/allevents");
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Delete Event
exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    return res.redirect("/admin/allevents");
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
      return res.status(404).send("Event not found");
    }

    const updateData = { title, description, date };

    if (req.file) {
      const oldImagePath = path.join(
        __dirname,
        "../uploads",
        existingEvent.image
      );
      fs.unlink(oldImagePath, (err) => {
        if (err) console.error("Error deleting old image:", err);
      });
      updateData.image = req.file.filename;
    }

    await Event.findByIdAndUpdate(eventId, updateData);
    res.redirect("/admin/allevents");
  } catch (err) {
    res.status(400).send("Update failed: " + err.message);
  }
};

exports.openEditEventPage = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).send("Event not found");
    res.render("admin/pages/editevent", { event });
  } catch (err) {
    console.error("Edit event load error:", err);
    res.status(500).send("Error loading event");
  }
};
