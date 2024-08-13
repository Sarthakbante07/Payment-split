const mongoose = require('mongoose');

const paymentInstructionSchema = new mongoose.Schema({
    members: [String],
    birthdayPerson: String,
    expenses: Map, // Stores key-value pairs for expenses
    instructions: [String],
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PaymentInstruction', paymentInstructionSchema);
