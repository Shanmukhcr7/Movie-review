document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const auth = firebase.auth();

    // Login Form Handler
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = loginForm.loginEmail.value;
            const password = loginForm.loginPassword.value;
            const messageElementId = 'login-message';

            try {
                await auth.signInWithEmailAndPassword(email, password);
                showMessage(messageElementId, 'Login successful! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html'; // Redirect to home page
                }, 1500);
            } catch (error) {
                console.error('Login error:', error);
                let errorMessage = 'Login failed. Please check your credentials.';
                if (error.code === 'auth/user-not-found') {
                    errorMessage = 'No user found with this email.';
                } else if (error.code === 'auth/wrong-password') {
                    errorMessage = 'Incorrect password.';
                } else if (error.code === 'auth/invalid-email') {
                    errorMessage = 'Invalid email address.';
                }
                showMessage(messageElementId, errorMessage, 'error');
            }
        });
    }

    // Register Form Handler
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = registerForm.registerUsername.value;
            const email = registerForm.registerEmail.value;
            const password = registerForm.registerPassword.value;
            const messageElementId = 'register-message';

            try {
                const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                await userCredential.user.updateProfile({
                    displayName: username
                });
                showMessage(messageElementId, 'Registration successful! Redirecting to login...', 'success');
                setTimeout(() => {
                    window.location.href = 'login.html'; // Redirect to login page
                }, 1500);
            } catch (error) {
                console.error('Registration error:', error);
                let errorMessage = 'Registration failed. Please try again.';
                if (error.code === 'auth/email-already-in-use') {
                    errorMessage = 'This email is already in use.';
                } else if (error.code === 'auth/weak-password') {
                    errorMessage = 'Password should be at least 6 characters.';
                } else if (error.code === 'auth/invalid-email') {
                    errorMessage = 'Invalid email address.';
                }
                showMessage(messageElementId, errorMessage, 'error');
            }
        });
    }
});