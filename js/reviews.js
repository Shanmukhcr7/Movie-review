document.addEventListener('DOMContentLoaded', () => {
    const reviewForm = document.getElementById('reviewForm');
    const starRatingContainer = document.getElementById('starRating');
    const ratingValueInput = document.getElementById('ratingValue');
    const reviewListDiv = document.getElementById('reviewList');
    const auth = firebase.auth(); // Get auth instance from main.js

    let currentRating = 0;

    // Dummy review data (simulating a backend)
    const dummyReviews = [
        {
            movie: "Inception",
            username: "FilmBuff123",
            rating: 5,
            comment: "A truly mind-bending masterpiece! Nolan's genius shines through in every frame. Highly recommend watching multiple times.",
            date: "2024-05-10"
        },
        {
            movie: "The Dark Knight",
            username: "GothamFan",
            rating: 5,
            comment: "Heath Ledger's Joker is legendary. A dark, gritty, and profound superhero film that transcends the genre.",
            date: "2024-04-22"
        },
        {
            movie: "Interstellar",
            username: "SpaceExplorer",
            rating: 4,
            comment: "Visually stunning and thought-provoking. The science can be a bit heavy, but the emotional core is powerful.",
            date: "2024-03-15"
        },
        {
            movie: "Pulp Fiction",
            username: "QuentinLover",
            rating: 4,
            comment: "A classic Tarantino! Witty dialogue, non-linear storytelling, and iconic scenes. A must-watch for any film fan.",
            date: "2024-02-28"
        }
    ];

    // Function to render reviews
    function renderReviews() {
        reviewListDiv.innerHTML = ''; // Clear existing reviews
        dummyReviews.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by most recent
        dummyReviews.forEach(review => {
            const reviewItem = document.createElement('div');
            reviewItem.classList.add('review-item');
            const starsHtml = '<i class="fas fa-star"></i>'.repeat(review.rating) +
                              '<i class="far fa-star"></i>'.repeat(5 - review.rating);

            reviewItem.innerHTML = `
                <h3>${review.movie}</h3>
                <div class="reviewer-info">
                    <span>by ${review.username}</span>
                    <span class="stars">${starsHtml}</span>
                    <span>on ${review.date}</span>
                </div>
                <p>${review.comment}</p>
            `;
            reviewListDiv.appendChild(reviewItem);
        });
    }

    // Star Rating Interactivity
    if (starRatingContainer) {
        starRatingContainer.addEventListener('mouseover', (e) => {
            if (e.target.classList.contains('fa-star')) {
                const value = parseInt(e.target.dataset.value);
                starRatingContainer.querySelectorAll('.fa-star').forEach((star, index) => {
                    if (index < value) {
                        star.classList.remove('far');
                        star.classList.add('fas');
                    } else {
                        star.classList.remove('fas');
                        star.classList.add('far');
                    }
                });
            }
        });

        starRatingContainer.addEventListener('mouseout', () => {
            starRatingContainer.querySelectorAll('.fa-star').forEach((star, index) => {
                if (index < currentRating) {
                    star.classList.remove('far');
                    star.classList.add('fas');
                } else {
                    star.classList.remove('fas');
                    star.classList.add('far');
                }
            });
        });

        starRatingContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('fa-star')) {
                currentRating = parseInt(e.target.dataset.value);
                ratingValueInput.value = currentRating; // Update hidden input
                // Visually confirm selection
                starRatingContainer.querySelectorAll('.fa-star').forEach((star, index) => {
                    if (index < currentRating) {
                        star.classList.remove('far');
                        star.classList.add('fas');
                    } else {
                        star.classList.remove('fas');
                        star.classList.add('far');
                    }
                });
            }
        });
    }

    // Review Form Submission
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const movieTitle = document.getElementById('movieTitle').value;
            let username = document.getElementById('reviewUsername').value;
            const rating = parseInt(ratingValueInput.value);
            const comments = document.getElementById('reviewComments').value;
            const messageElementId = 'review-message';

            if (rating === 0) {
                showMessage(messageElementId, 'Please select a star rating!', 'error');
                return;
            }

            // Get current user from Firebase auth
            const user = auth.currentUser;
            if (!user) {
                username = username || 'Guest'; // If not logged in, allow manual input or default to Guest
            } else {
                username = user.displayName || user.email; // Use logged-in user's display name or email
            }


            const newReview = {
                movie: movieTitle,
                username: username,
                rating: rating,
                comment: comments,
                date: new Date().toISOString().slice(0, 10) // YYYY-MM-DD
            };

            dummyReviews.unshift(newReview); // Add to the beginning of the array
            renderReviews(); // Re-render the list

            showMessage(messageElementId, 'Review submitted successfully!', 'success');
            reviewForm.reset(); // Clear form
            currentRating = 0; // Reset star rating
            ratingValueInput.value = 0;
            starRatingContainer.querySelectorAll('.fa-star').forEach(star => {
                star.classList.remove('fas');
                star.classList.add('far');
            });
        });
    }

    // Initial render of reviews when page loads
    renderReviews();
});