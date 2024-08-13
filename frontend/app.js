document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('expenseForm');
    const membersList = document.getElementById('membersList');
    const expensesList = document.getElementById('expensesList');
    const results = document.getElementById('results');

    // Handle the number of members input
    document.getElementById('numMembers').addEventListener('input', function() {
        const num = parseInt(this.value);
        membersList.innerHTML = '';
        for (let i = 0; i < num; i++) {
            membersList.innerHTML += `
                <div class="mb-2">
                    <label for="member${i}" class="block text-gray-700">Member ${i + 1}:</label>
                    <input type="text" id="member${i}" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required>
                </div>
            `;
        }
    });

    // Handle form submission
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const numMembers = parseInt(document.getElementById('numMembers').value);
        const members = [];
        for (let i = 0; i < numMembers; i++) {
            members.push(document.getElementById(`member${i}`).value);
        }
        const birthdayPerson = document.getElementById('birthdayPerson').value;

        // Collect expenses
        const expenses = {};
        for (let i = 0; i < numMembers; i++) {
            const member = members[i];
            const amount = parseFloat(prompt(`Enter amount spent by ${member}:`)) || 0;
            if (amount > 0) {
                expenses[member] = amount;
            }
        }

        // Send data to the backend
        const response = await fetch('/api/expenses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                members,
                birthdayPerson,
                expenses,
            }),
        });

        const result = await response.json();

        // Display results
        results.innerHTML = '<h2 class="text-xl font-semibold mb-4">Payment Instructions:</h2>';
        result.instructions.forEach(instruction => {
            results.innerHTML += `<p>${instruction}</p>`;
        });
    });
});
