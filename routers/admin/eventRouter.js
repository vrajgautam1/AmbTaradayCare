const express = require("express");
const router = express.Router();
const eventController = require("../../controllers/eventController");
const upload = require("../../middleware/multerMiddleWare");

// Admin creates event with image
router.post("/createevent", upload.single("image"), eventController.createEvent);

// View all events (admin)
router.get("/allevents", eventController.getAllEvents);

// View upcoming (approved) events (client)
router.get("/upcomingevents", eventController.getUpcomingEvents);

// View past (approved) events (client)
router.get("/pastevents", eventController.getPastEvents);

// Approve or remove events (admin)
router.get("/approveEvent/:id", eventController.approveEvent);
router.get("/disapproveEvent/:id", eventController.removeEvent);

// Delete event (admin)
router.get("/event/:id/delete", eventController.deleteEvent);

// Show edit form (GET)
router.get("/event/:id", eventController.openEditEventPage);

// Edit event (admin)
router.post("/event/:id/edit", upload.single("image"), eventController.editEvent);


module.exports = router;
