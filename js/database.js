// Data layer: localStorage demo fallback + Firestore when Firebase is configured.
// For production, ensure Firestore Security Rules restrict each user's documents.
async function firebaseDb() {
  if (!window.FIREBASE_ENABLED || !window.firebaseModules?.db) return null;
  return window.firebaseModules.db;
}
async function persistResume(data) {
  localStorage.setItem("rc_resume", JSON.stringify(data));
  const user = getUser();
  const db = await firebaseDb();
  if (db && user?.uid) {
    const { doc, setDoc, serverTimestamp } = window.firebaseModules;
    await setDoc(doc(db, "users", user.uid, "resumes", "default"), {
      ...data, updatedAt: serverTimestamp()
    }, { merge: true });
  }
}
async function fetchResume() {
  const user = getUser();
  const db = await firebaseDb();
  if (db && user?.uid) {
    try {
      const { doc, getDoc } = window.firebaseModules;
      const snap = await getDoc(doc(db, "users", user.uid, "resumes", "default"));
      if (snap.exists()) {
        const data = snap.data();
        localStorage.setItem("rc_resume", JSON.stringify(data));
        return data;
      }
    } catch (e) { console.warn("Could not load cloud resume:", e); }
  }
  return getResume();
}
async function saveNamedResume(name) {
  const user = getUser();
  const data = getResume();
  const list = JSON.parse(localStorage.getItem("rc_saved_resumes") || "[]");
  const item = {id: Date.now(), name, data, savedAt: new Date().toISOString()};
  list.push(item);
  localStorage.setItem("rc_saved_resumes", JSON.stringify(list));
  const db = await firebaseDb();
  if (db && user?.uid) {
    const { doc, setDoc, serverTimestamp } = window.firebaseModules;
    await setDoc(doc(db, "users", user.uid, "resumes", String(item.id)), {
      name, data, updatedAt: serverTimestamp()
    });
  }
  return item;
}
