/**
 * AINTERCOM OS — Script de Login
 * Gère les formulaires de connexion et d'inscription
 */

// Vérifier que window.AintercomAuth est disponible
if (typeof window.AintercomAuth === 'undefined') {
  console.error('❌ window.AintercomAuth est undefined. Vérifiez l\'ordre des imports dans login.html');
  window.AintercomAuth = {
    signInWithEmail: () => Promise.resolve({ success: false, error: 'Auth non initialisé' }),
    signUpWithEmail: () => Promise.resolve({ success: false, error: 'Auth non initialisé' }),
    signInWithGoogle: () => Promise.resolve({ success: false, error: 'Auth non initialisé' }),
    getSession: () => null,
    demoSignIn: () => ({ success: false, error: 'Mode démo non disponible' })
  };
}

// DOM Elements
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const toggleLogin = document.getElementById('toggle-login');
const toggleSignup = document.getElementById('toggle-signup');
const messageEl = document.getElementById('message');
const googleSigninBtn = document.getElementById('google-signin');

// Show login form
function showLoginForm() {
  loginForm.style.display = 'flex';
  signupForm.style.display = 'none';
  toggleLogin.classList.add('active');
  toggleSignup.classList.remove('active');
  clearMessage();
}

// Show signup form
function showSignupForm() {
  loginForm.style.display = 'none';
  signupForm.style.display = 'flex';
  toggleLogin.classList.remove('active');
  toggleSignup.classList.add('active');
  clearMessage();
}

// Show forgot password
function showForgotPassword() {
  clearMessage();
  showMessage('info', 'Fonctionnalité en développement. Contactez support@aintercom.com');
}

// Display message
function showMessage(type, text) {
  messageEl.textContent = text;
  messageEl.className = `message ${type}`;
  messageEl.style.display = 'block';
  
  // Auto-hide success messages after 5 seconds
  if (type === 'success') {
    setTimeout(() => {
      messageEl.style.display = 'none';
    }, 5000);
  }
}

// Clear message
function clearMessage() {
  messageEl.style.display = 'none';
  messageEl.textContent = '';
}

// Handle login form submission
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  
  if (!email || !password) {
    showMessage('error', 'Veuillez remplir tous les champs');
    return;
  }
  
  // Show loading state
  const submitBtn = document.getElementById('login-submit');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<span>⏳ CONNEXION...</span>';
  submitBtn.disabled = true;
  
  try {
    // Use auth-logic.js
    const result = await window.AintercomAuth.signInWithEmail(email, password);
    
    if (result.success) {
      showMessage('success', 'Connexion réussie ! Redirection vers le tableau de bord...');
      
      // Use gateway.js for redirection
      if (window.AintercomGateway && window.AintercomGateway.redirectAfterLogin) {
        window.AintercomGateway.redirectAfterLogin();
      } else {
        // Fallback redirection
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1500);
      }
    } else {
      showMessage('error', result.error || 'Échec de la connexion');
    }
  } catch (error) {
    showMessage('error', 'Erreur lors de la connexion: ' + error.message);
  } finally {
    // Restore button state
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
});

// Handle signup form submission
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  const confirmPassword = document.getElementById('signup-confirm').value;
  
  // Validation
  if (!name || !email || !password || !confirmPassword) {
    showMessage('error', 'Veuillez remplir tous les champs');
    return;
  }
  
  if (password.length < 8) {
    showMessage('error', 'Le mot de passe doit contenir au moins 8 caractères');
    return;
  }
  
  if (password !== confirmPassword) {
    showMessage('error', 'Les mots de passe ne correspondent pas');
    return;
  }
  
  // Show loading state
  const submitBtn = document.getElementById('signup-submit');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<span>⏳ CRÉATION...</span>';
  submitBtn.disabled = true;
  
  try {
    // Use auth-logic.js
    const result = await window.AintercomAuth.signUpWithEmail(email, password, name);
    
    if (result.success) {
      showMessage('success', result.message || 'Compte créé avec succès ! Vérifiez votre email.');
      
      // Switch back to login form after 3 seconds
      setTimeout(() => {
        showLoginForm();
        document.getElementById('login-email').value = email;
      }, 3000);
    } else {
      showMessage('error', result.error || 'Échec de l\'inscription');
    }
  } catch (error) {
    showMessage('error', 'Erreur lors de l\'inscription: ' + error.message);
  } finally {
    // Restore button state
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
});

// Handle Google sign-in
googleSigninBtn.addEventListener('click', async () => {
  googleSigninBtn.disabled = true;
  const originalText = googleSigninBtn.innerHTML;
  googleSigninBtn.innerHTML = '<span>⏳ REDIRECTION GOOGLE...</span>';
  
  try {
    const result = await window.AintercomAuth.signInWithGoogle();
    
    if (!result.success) {
      showMessage('error', result.error || 'Échec de la connexion Google');
      googleSigninBtn.disabled = false;
      googleSigninBtn.innerHTML = originalText;
    }
    // If success, user will be redirected by Supabase OAuth
  } catch (error) {
    showMessage('error', 'Erreur Google Sign-In: ' + error.message);
    googleSigninBtn.disabled = false;
    googleSigninBtn.innerHTML = originalText;
  }
});

// Demo login for testing
function demoLogin() {
  document.getElementById('login-email').value = 'demo@aintercom.com';
  document.getElementById('login-password').value = 'demo123';
  
  // Trigger login after 500ms
  setTimeout(() => {
    loginForm.dispatchEvent(new Event('submit'));
  }, 500);
}

// Auto-fill demo credentials on double-click logo
document.querySelector('.login-logo').addEventListener('dblclick', demoLogin);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ Login page initialized');
  
  // Check if already logged in
  const session = window.AintercomAuth?.getSession();
  if (session) {
    showMessage('info', `Déjà connecté en tant que ${session.email}. Redirection...`);
    
    // Use gateway.js for redirection
    if (window.AintercomGateway && window.AintercomGateway.redirectAfterLogin) {
      window.AintercomGateway.redirectAfterLogin();
    } else {
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 2000);
    }
  }
});