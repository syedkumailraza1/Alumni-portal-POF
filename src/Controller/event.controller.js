const Event = require("../Model/Event.model.js")
const Student = require('../Model/Student.model.js');

const CreateEvent = async(req, res)=>{
    try {
        const {title, description, post, date, location, createdBy} = req.body
        console.log(req.body);
        if (!title) return res.status(400).json({ error: "Title is Required" });
        if (!description) return res.status(400).json({ error: "Description is Required" });
        if (!date) return res.status(400).json({ error: "Date is Required" });
        if (!location) return res.status(400).json({ error: "location is Required" });

        const studentExists = await Student.findById(createdBy);
        if (!studentExists) {
            return res.status(404).json({ error: "Student not found" });
        }
        
        const newEvent = new Event({title, description, post, date, location, createdBy})
        await newEvent.save()
        res.status(201).json({ message: "Event Created Successfully" });
    } catch (error) {
        console.log("Error during creating event: ",error);
        
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const GetEvents = async (req,res)=>{
 
    try {
      const allEvents = await Event.find();
      res.json(allEvents);
  } catch (error) {
      res.status(500).json({ error: 'Internal server error:', error });
      console.log(error);
  }
  }

  const DeleteEvent = async (req,res)=>{
    try {
        //find the event
        const eventId = req.params.id
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ error: "Event not found" });
        
        //delete event
        await event.deleteOne({_id: eventId})
    
        //display success message 
       res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        console.log("Error during deleting event: ",error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  const UpdateEvent = async (req,res)=>{
    try {
        //find the event id
        const event = req.body
        const eventId = req.params.id
        const eventExist = await Event.findById(eventId);
        if (!eventExist) return res.status(404).json({ error: "Event not found"})

        //update it
        await Event.updateOne(
            {"_id": eventId},
            {$set: event}
        )

        //give success message
        res.status(200).json({ message: "Event updated successfully" });
    } catch (error) {
        console.log("Error  during updating event: ",error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  const SearchEvent = async (req,res)=>{
    try {
        //get the event id
        const eventId = req.params.id
        
        //find the event
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ error: "Event not found"})

        //show event
        res.status(200).json(event);
        console.log(event);
        
    } catch (error) {
        console.log("Error during Searching Event: ",error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
  }
module.exports = {CreateEvent, GetEvents, UpdateEvent, DeleteEvent, SearchEvent}