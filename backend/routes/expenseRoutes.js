// expenseRoute.js

const express = require('express');
const router = express.Router();
const PaymentInstruction = require('../models/paymentInstruction'); // Import the model

// Existing route to handle expense calculations
router.post('/', async (req, res) => {
    const { members, birthdayPerson, expenses } = req.body;

    // Calculate the instructions as before
    const totalAmount = Object.values(expenses).reduce((acc, amount) => acc + amount, 0);
    const numPeople = members.length;
    const amountPerPerson = totalAmount / (numPeople - 1); // Excluding the birthday person

    const instructions = [];
    const balance = {};
    for (let member of members) {
        if (member !== birthdayPerson) {
            balance[member] = amountPerPerson - (expenses[member] || 0);
        }
    }

    const payees = members.filter(member => member !== birthdayPerson && balance[member] < 0);
    const payers = members.filter(member => member !== birthdayPerson && balance[member] > 0);

    payees.forEach(payee => {
        payers.forEach(payer => {
            if (balance[payer] > 0) {
                const amount = Math.min(balance[payer], -balance[payee]);
                if (amount > 0) {
                    instructions.push(`${payer} pays ${amount.toFixed(2)}rs to ${payee}`);
                    balance[payer] -= amount;
                    balance[payee] += amount;
                }
            }
        });
    });

    // Save the instructions to MongoDB
    try {
        const newPaymentInstruction = new PaymentInstruction({
            members,
            birthdayPerson,
            expenses,
            instructions
        });
        await newPaymentInstruction.save();
        res.json({ instructions });
    } catch (error) {
        console.error('Error saving payment instructions:', error);
        res.status(500).json({ error: 'Error saving payment instructions' });
    }
});

// New route to get all payment instructions
router.get('/history', async (req, res) => {
    try {
        const history = await PaymentInstruction.find().sort({ date: -1 }); // Sort by date, most recent first
        res.json(history);
    } catch (error) {
        console.error('Error fetching payment history:', error);
        res.status(500).json({ error: 'Error fetching payment history' });
    }
});

module.exports = router;
