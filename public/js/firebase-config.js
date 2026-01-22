const firebaseConfig = {
  apiKey: "AIzaSyDQvuynWqC871n7Vnezyo78OFYAQKbZrMw",
  authDomain: "shreeji-vastraalay.firebaseapp.com",
  projectId: "shreeji-vastraalay",
  storageBucket: "shreeji-vastraalay.firebasestorage.app",
  messagingSenderId: "31299324907",
  appId: "1:31299324907:web:76999b5154faaa736a27ae"
};

// Initialize Firebase
try {
  firebase.initializeApp(firebaseConfig);
  console.log("Firebase initialized successfully");
} catch (error) {
  if (!/already exists/.test(error.message)) {
    console.error("Firebase initialization error", error);
  }
}

// Make services available if needed (though app.js uses firebase.firestore() directly)
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
