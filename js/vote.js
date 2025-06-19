document.addEventListener('DOMContentLoaded', () => {
    const voteSections = {
        actor: document.querySelector('#bestActorVote .nominee-grid'),
        director: document.querySelector('#bestDirectorVote .nominee-grid'),
        film: document.querySelector('#bestFilmVote .nominee-grid')
    };

    const submitButtons = document.querySelectorAll('.vote-submit-btn');
    const voteMessageElement = document.getElementById('vote-message');

    // Dummy nominee data
    const nominees = {
        actor: [
            { id: 'actor1', name: 'Leonardo DiCaprio', image: 'assets/images/actor1.jpg' }, // Updated path
            { id: 'actor2', name: 'Tom Hanks', image: 'assets/images/actor2.jpg' },     // Updated path
            { id: 'actor3', name: 'Meryl Streep', image: 'assets/images/actor3.jpg' },   // Updated path
            { id: 'actor4', name: 'Denzel Washington', image: 'assets/images/actor4.jpg' } // Updated path
        ],
        director: [
            { id: 'director1', name: 'Christopher Nolan', image: 'assets/images/director1.jpg' }, // Updated path
            { id: 'director2', name: 'Greta Gerwig', image: 'assets/images/director2.jpg' },     // Updated path
            { id: 'director3', name: 'Denis Villeneuve', image: 'assets/images/director3.jpg' }, // Updated path
            { id: 'director4', name: 'Quentin Tarantino', image: 'assets/images/director4.jpg' } // Updated path
        ],
        film: [
            { id: 'film1', name: 'Oppenheimer', image: 'assets/images/film1.jpg' }, // Updated path
            { id: 'film2', name: 'Barbie', image: 'assets/images/film2.jpg' },     // Updated path
            { id: 'film3', name: 'Dune: Part Two', image: 'assets/images/film3.jpg' }, // Updated path
            { id: 'film4', name: 'Past Lives', image: 'assets/images/film4.jpg' }   // Updated path
        ]
    };

    // Store selected votes in local storage (or a dummy object for session)
    let userVotes = JSON.parse(localStorage.getItem('cinepulseVotes')) || {};

    // Function to render nominees for a category
    function renderNominees(category, container) {
        container.innerHTML = ''; // Clear existing
        nominees[category].forEach(nominee => {
            const nomineeCard = document.createElement('div');
            nomineeCard.classList.add('nominee-card');
            if (userVotes[category] === nominee.id) {
                nomineeCard.classList.add('selected');
            }
            nomineeCard.dataset.id = nominee.id;
            nomineeCard.innerHTML = `
                <img src="${nominee.image}" alt="${nominee.name}">
                <div class="nominee-card-info">
                    <h3>${nominee.name}</h3>
                </div>
            `;
            container.appendChild(nomineeCard);

            nomineeCard.addEventListener('click', () => {
                // Deselect any previously selected in this category
                container.querySelectorAll('.nominee-card').forEach(card => {
                    card.classList.remove('selected');
                });
                // Select the clicked card
                nomineeCard.classList.add('selected');
                userVotes[category] = nominee.id; // Store selection
                localStorage.setItem('cinepulseVotes', JSON.stringify(userVotes));
            });
        });
    }

    // Initialize nominee rendering for all categories
    for (const category in voteSections) {
        renderNominees(category, voteSections[category]);
    }

    // Handle submit vote buttons
    submitButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const category = e.target.dataset.category;
            const selectedNomineeId = userVotes[category];

            if (!selectedNomineeId) {
                showMessage('vote-message', `Please select a nominee for ${category} before submitting.`, 'error');
                return;
            }

            const selectedNominee = nominees[category].find(n => n.id === selectedNomineeId);
            showMessage('vote-message', `Your vote for ${selectedNominee.name} in Best ${category.charAt(0).toUpperCase() + category.slice(1)} has been cast! (Dummy submission)`, 'success');

            // In a real application, you would send this vote to a backend.
            console.log(`Dummy Submission: User voted for ${selectedNominee.name} (${selectedNomineeId}) in ${category} category.`);

            // Optionally, disable voting for this category after submission
            // button.disabled = true;
            // voteSections[category].querySelectorAll('.nominee-card').forEach(card => card.style.pointerEvents = 'none');
        });
    });

    // Helper to display messages
    function showMessage(elementId, message, type) {
        const messageElement = document.getElementById(elementId);
        if (message) { // Check if messageElement exists
            messageElement.textContent = message;
            messageElement.className = `message ${type}`;
            messageElement.style.display = 'block';
            setTimeout(() => {
                messageElement.style.display = 'none';
            }, 5000);
        }
    }
});