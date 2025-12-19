/* ================================================================
   TOOLKIT E-COMMERCE - AUTHENTICATION SYSTEM
   ================================================================ */

// ================================================================
// AUTH MANAGER - Handles user authentication
// ================================================================
const authManager = {
    // Get all users from localStorage
    getAllUsers: () => {
        return JSON.parse(localStorage.getItem('toolkit_users') || '[]');
    },

    // Save users to localStorage
    saveUsers: (users) => {
        localStorage.setItem('toolkit_users', JSON.stringify(users));
    },

    // Get current session
    getSession: () => {
        return JSON.parse(localStorage.getItem('toolkit_session') || 'null');
    },

    // Save current session
    setSession: (user) => {
        localStorage.setItem('toolkit_session', JSON.stringify(user));
    },

    // Clear session
    clearSession: () => {
        localStorage.removeItem('toolkit_session');
    },

    // Sign up new user
    signUp: (email, password, name) => {
        // Validate inputs
        if (!email || !password || !name) {
            return { success: false, message: 'All fields are required' };
        }

        if (password.length < 6) {
            return { success: false, message: 'Password must be at least 6 characters' };
        }

        // Check email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { success: false, message: 'Invalid email format' };
        }

        // Get all users
        const users = authManager.getAllUsers();

        // Check if email already exists
        if (users.find(u => u.email === email)) {
            return { success: false, message: 'Email already registered' };
        }

        // Create new user
        const newUser = {
            id: Math.floor(Date.now() / 1000),
            email: email,
            password: password, // In production, this should be hashed!
            name: name,
            createdAt: new Date().toISOString()
        };

        // Add user to list
        users.push(newUser);
        authManager.saveUsers(users);

        // Log user in
        authManager.setSession(newUser);

        return { success: true, message: 'Account created successfully', user: newUser };
    },

    // Login user
    login: (email, password) => {
        // Validate inputs
        if (!email || !password) {
            return { success: false, message: 'Email and password are required' };
        }

        // Get all users
        const users = authManager.getAllUsers();

        // Find user by email and password
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            return { success: false, message: 'Invalid email or password' };
        }

        // Set session
        authManager.setSession(user);

        return { success: true, message: 'Logged in successfully', user: user };
    },

    // Logout user
    logout: () => {
        authManager.clearSession();
        return { success: true, message: 'Logged out successfully' };
    },

    // Check if user is logged in
    isLoggedIn: () => {
        return authManager.getSession() !== null;
    },

    // Get current user
    getCurrentUser: () => {
        return authManager.getSession();
    },

    // Update user profile
    updateProfile: (userId, updates) => {
        const users = authManager.getAllUsers();
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
            return { success: false, message: 'User not found' };
        }

        // Update user
        users[userIndex] = { ...users[userIndex], ...updates };
        authManager.saveUsers(users);

        // Update session if it's the current user
        const currentUser = authManager.getCurrentUser();
        if (currentUser && currentUser.id === userId) {
            authManager.setSession(users[userIndex]);
        }

        return { success: true, message: 'Profile updated', user: users[userIndex] };
    },

    // Change password
    changePassword: (email, oldPassword, newPassword) => {
        if (!newPassword || newPassword.length < 6) {
            return { success: false, message: 'Password must be at least 6 characters' };
        }

        const users = authManager.getAllUsers();
        const user = users.find(u => u.email === email && u.password === oldPassword);

        if (!user) {
            return { success: false, message: 'Current password is incorrect' };
        }

        // Update password
        const updatedUser = { ...user, password: newPassword };
        const userIndex = users.findIndex(u => u.id === user.id);
        users[userIndex] = updatedUser;
        authManager.saveUsers(users);

        // Update session
        authManager.setSession(updatedUser);

        return { success: true, message: 'Password changed successfully' };
    },

    // Get user by email
    getUserByEmail: (email) => {
        const users = authManager.getAllUsers();
        return users.find(u => u.email === email);
    },

    // Check if email exists
    emailExists: (email) => {
        return authManager.getUserByEmail(email) !== undefined;
    }
};

// ================================================================
// INITIALIZE DEMO USER
// ================================================================
function initializeDemoUser() {
    const users = authManager.getAllUsers();
    
    // Check if demo user already exists
    if (users.some(u => u.email === 'demo@toolkit.com')) {
        return;
    }

    // Create demo user
    const demoUser = {
        id: 1000000000,
        email: 'demo@toolkit.com',
        password: 'demo123',
        name: 'Demo User',
        createdAt: new Date().toISOString()
    };

    users.push(demoUser);
    authManager.saveUsers(users);
}

// Initialize demo user on page load
initializeDemoUser();

// ================================================================
// UPDATE AUTH UI
// ================================================================
function updateAuthUI() {
    const authContainer = document.querySelector('.auth-container');
    const currentUser = authManager.getCurrentUser();

    if (!authContainer) return;

    if (currentUser) {
        // User is logged in
        authContainer.innerHTML = `
            <div style="display: flex; align-items: center; gap: var(--sp-md);">
                <span style="font-size: var(--font-size-sm); color: var(--gray);">
                    👤 ${currentUser.name}
                </span>
                <button id="logout-btn" class="btn btn-secondary" style="padding: var(--sp-sm) var(--sp-md); font-size: var(--font-size-sm);">
                    Logout
                </button>
            </div>
        `;

        // Add logout handler
        document.getElementById('logout-btn').addEventListener('click', () => {
            authManager.logout();
            Toolkit.showToast('Logged out successfully! 👋');
            updateAuthUI();
            setTimeout(() => window.location.reload(), 500);
        });
    } else {
        // User is not logged in
        authContainer.innerHTML = `
            <div style="display: flex; gap: var(--sp-md);">
                <button id="login-btn" class="btn btn-primary" style="padding: var(--sp-sm) var(--sp-md); font-size: var(--font-size-sm);">
                    Login
                </button>
                <button id="signup-btn" class="btn btn-outline" style="padding: var(--sp-sm) var(--sp-md); font-size: var(--font-size-sm);">
                    Sign Up
                </button>
            </div>
        `;

        // Add modal handlers
        const loginBtn = document.getElementById('login-btn');
        const signupBtn = document.getElementById('signup-btn');

        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                Toolkit.openModal('login-modal');
            });
        }

        if (signupBtn) {
            signupBtn.addEventListener('click', () => {
                Toolkit.openModal('signup-modal');
            });
        }
    }
}

// Update auth UI when page loads
document.addEventListener('DOMContentLoaded', updateAuthUI);

// ================================================================
// MODAL UTILITIES
// ================================================================
const ModalUtils = {
    openModal: (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    },

    closeModal: (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    },

    closeAllModals: () => {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
            modal.style.display = 'none';
        });
        document.body.style.overflow = 'auto';
    }
};

// ================================================================
// MODAL EVENT LISTENERS
// ================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Close modal on close button click
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) {
                ModalUtils.closeModal(modal.id);
            }
        });
    });

    // Close modal on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                ModalUtils.closeModal(modal.id);
            }
        });
    });

    // Modal switching
    document.querySelectorAll('[data-modal]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetModal = link.getAttribute('data-modal');
            const currentModal = link.closest('.modal');
            
            if (currentModal) {
                ModalUtils.closeModal(currentModal.id);
            }
            
            ModalUtils.openModal(targetModal);
        });
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            ModalUtils.closeAllModals();
        }
    });
});

// ================================================================
// FORM VALIDATION HELPERS
// ================================================================
const FormValidator = {
    // Validate email format
    isValidEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Validate password strength
    isValidPassword: (password) => {
        return password && password.length >= 6;
    },

    // Validate name
    isValidName: (name) => {
        return name && name.trim().length >= 2;
    },

    // Validate phone number
    isValidPhone: (phone) => {
        const phoneRegex = /^[0-9]{10,}$/;
        return phoneRegex.test(phone.replace(/\D/g, ''));
    },

    // Get password strength
    getPasswordStrength: (password) => {
        if (!password) return 'weak';
        if (password.length < 6) return 'weak';
        if (password.length < 8) return 'medium';
        
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*]/.test(password);

        if (hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar) return 'strong';
        if (hasUpperCase && hasLowerCase && hasNumbers) return 'strong';
        if (hasUpperCase && hasLowerCase) return 'medium';
        
        return 'medium';
    }
};

// ================================================================
// SESSION PERSISTENCE
// ================================================================
window.addEventListener('beforeunload', () => {
    // Session is automatically saved to localStorage
    // This event handler can be used for cleanup if needed
});

window.addEventListener('load', () => {
    // Restore session from localStorage
    const session = authManager.getSession();
    if (session) {
        console.log('Session restored:', session.name);
    }
});

// ================================================================
// LOGOUT ON TAB CLOSE (OPTIONAL)
// ================================================================
// Uncomment below to logout user when all tabs are closed
/*
window.addEventListener('beforeunload', () => {
    if (authManager.isLoggedIn()) {
        localStorage.removeItem('toolkit_session');
    }
});
*/

// ================================================================
// EXPORT FOR EXTERNAL USE
// ================================================================
// authManager is available globally
// ModalUtils.openModal('login-modal')
// ModalUtils.closeModal('login-modal')
// FormValidator.isValidEmail('test@example.com')
