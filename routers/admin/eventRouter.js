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
router.patch("/event/:id/approve", eventController.approveEvent);
router.patch("/event/:id/remove", eventController.removeEvent);

// Delete event (admin)
router.delete("/event/:id/delete", eventController.deleteEvent);

// Edit event (admin)
router.put("/event/:id/edit", upload.single("image"), eventController.editEvent);


module.exports = router;
