// Initialize Firebase using the config from config.js
let app;
try {
    app = firebase.initializeApp(window.__firebase_config);
} catch (error) {
    console.error("Firebase initialization error:", error);
    // Attempt anonymous sign-in if initial app initialization fails (e.g., config missing)
    firebase.auth().signInAnonymously().catch((anonError) => {
        console.error("Anonymous sign-in failed:", anonError);
    });
}

const auth = firebase.auth();

document.addEventListener('DOMContentLoaded', () => {
    const welcomeMessage = document.getElementById('welcome-message');
    const authButton = document.getElementById('auth-button');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Toggle mobile menu
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Auth state listener
    auth.onAuthStateChanged(user => {
        if (user) {
            // User is signed in.
            const username = user.displayName || user.email || 'Guest';
            welcomeMessage.textContent = `Welcome, ${username}!`;
            authButton.textContent = 'Logout';
            authButton.removeEventListener('click', redirectToAuthPage); // Remove previous listener
            authButton.addEventListener('click', handleLogout);

            // Update review form username if on reviews page
            const reviewUsernameInput = document.getElementById('reviewUsername');
            if (reviewUsernameInput) {
                reviewUsernameInput.value = user.displayName || user.email;
                reviewUsernameInput.disabled = true; // Disable if logged in
            }
        } else {
            // User is signed out.
            welcomeMessage.textContent = '';
            authButton.textContent = 'Login / Register';
            authButton.removeEventListener('click', handleLogout); // Remove previous listener
            authButton.addEventListener('click', redirectToAuthPage);

            // Update review form username if on reviews page
            const reviewUsernameInput = document.getElementById('reviewUsername');
            if (reviewUsernameInput) {
                reviewUsernameInput.value = '';
                reviewUsernameInput.disabled = false; // Enable if logged out (for anonymous submission)
                reviewUsernameInput.placeholder = "Appears as 'Guest' if not logged in";
            }
        }
    });

    function redirectToAuthPage() {
        window.location.href = 'login.html';
    }

    async function handleLogout() {
        try {
            await auth.signOut();
            showMessage('logout-message', 'Logged out successfully!', 'success');
            // Redirect to home or login page after logout, or just update UI
            window.location.href = 'index.html'; // Or 'login.html'
        } catch (error) {
            console.error('Logout error:', error);
            showMessage('logout-message', `Logout failed: ${error.message}`, 'error');
        }
    }

    // Function to display in-page messages
    window.showMessage = (elementId, message, type) => {
        const messageElement = document.getElementById(elementId);
        if (messageElement) {
            messageElement.textContent = message;
            messageElement.className = `message ${type}`;
            messageElement.style.display = 'block';
            setTimeout(() => {
                messageElement.style.display = 'none';
            }, 5000); // Hide after 5 seconds
        }
    };
});