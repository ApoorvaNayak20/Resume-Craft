// Firebase SDK is loaded from the official CDN on login.html.
// Demo mode is for local prototyping only; it is not real authentication.
async function initAuth() {
  const form = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const msg = document.getElementById("authMessage");
  const show = text => { msg.textContent = text; msg.classList.remove("hidden"); };
  const firebaseReady = window.FIREBASE_ENABLED === true &&
    window.firebaseConfig?.apiKey &&
    !window.firebaseConfig.apiKey.startsWith("PASTE_");

  let auth = null, 
  createUser = null, 
  signIn = null, 
  setPersistenceFn = null, 
  browserLocal = null, 
  browserSession = null;

  if (firebaseReady && window.firebaseModules) {
    const m = window.firebaseModules;
    auth = m.auth;
    createUser = m.createUserWithEmailAndPassword;
    signIn = m.signInWithEmailAndPassword;
    setPersistenceFn = m.setPersistence;
    browserLocal = m.browserLocalPersistence;
    browserSession = m.browserSessionPersistence;
  }

  form.addEventListener("submit", async e => {

    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const remember = document.getElementById("rememberMe").checked;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) 
      return show("Please enter a valid email address.");
    if (!password) 
      return show("Please enter your password.");
    
    try {
      if (auth) {
        await setPersistenceFn(auth, remember ? browserLocal : browserSession);
        const result = await signIn(auth, email, password);
        localStorage.setItem("rc_user", JSON.stringify({uid: result.user.uid, email: result.user.email, provider:"firebase"}));
      } else {
        if (email !== "demo@example.com" || password !== "demo123") {
          return show("Demo mode: use demo@example.com and demo123. Configure Firebase for real accounts.");
        }
        localStorage.setItem("rc_user", JSON.stringify({email, provider:"demo"}));
        if (!remember) sessionStorage.setItem("rc_session_only", "1");
      }
      location.href = "index.html";
    } catch (err) {
      show(err.message || "Unable to sign in. Check your details and try again.");
    }
  });

  registerForm.addEventListener("submit", async e => {
    e.preventDefault();
    const email = document.getElementById("registerEmail").value.trim();
    const pass = document.getElementById("registerPassword").value;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return show("Enter a valid email address.");
    if (pass.length < 6) return show("Use a password with at least 6 characters.");
    if (!auth) return show("Registration requires Firebase setup. Follow README.txt, or use demo login to explore.");
    try {
      const result = await createUser(auth, email, pass);
      localStorage.setItem("rc_user", JSON.stringify({uid: result.user.uid, email: result.user.email, provider:"firebase"}));
      location.href = "index.html";
    } catch (err) { show(err.message || "Registration failed."); }
  });

  const googleBtn = document.getElementById("googleLogin");
  googleBtn.addEventListener("click", async () => {
    if (!auth || !window.firebaseModules.signInWithPopup || !window.firebaseModules.GoogleAuthProvider) {
      return show("Google sign-in needs Firebase configuration and Google provider enabled in Firebase Authentication.");
    }
    try {
      const provider = new window.firebaseModules.GoogleAuthProvider();
      const result = await window.firebaseModules.signInWithPopup(auth, provider);
      localStorage.setItem("rc_user", JSON.stringify({uid: result.user.uid, email: result.user.email, provider:"google"}));
      location.href = "index.html";
    } catch (err) { show(err.message || "Google sign-in failed."); }
  });
}
document.addEventListener("DOMContentLoaded", initAuth);
