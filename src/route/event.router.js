const express = require('express');
const router = express.Router();
const { CreateEvent, GetEvents, UpdateEvent, DeleteEvent, SearchEvent } = require("../Controller/event.controller.js");

router.post("/create-event", CreateEvent);
router.get("/events", GetEvents);
router.post("/event/:id", DeleteEvent);
router.put("/event/:id", UpdateEvent);
router.get("/event/:id", SearchEvent);


module.exports = router;
