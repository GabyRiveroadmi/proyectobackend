import mongoose from "mongoose";

const { v4: uuidv4 } = require('uuid');

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    default: uuidv4,  
  },
  purchase_datetime: {
    type: Date,
    default: Date.now, 
  },
  amount: {
    type: Number,
    required: true, 
  },
  purchaser: {
    type: String,
    required: true,  
  },
});

const TicketModel = mongoose.model("tickets", ticketSchema);

export default TicketModel;
