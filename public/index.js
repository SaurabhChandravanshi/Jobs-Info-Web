import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.3/firebase-app.js'

// Add Firebase products that you want to use
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.3/firebase-auth.js'
import { getFirestore} from 'https://www.gstatic.com/firebasejs/9.6.3/firebase-firestore.js'

const firebaseConfig = {
    apiKey: "AIzaSyAlUnM_OYcUHBCGgrzNLyVqke-URN9z9AA",
    authDomain: "jobs-info-india.firebaseapp.com",
    databaseURL: "https://jobs-info-india-default-rtdb.firebaseio.com",
    projectId: "jobs-info-india",
    storageBucket: "jobs-info-india.appspot.com",
    messagingSenderId: "112204929962",
    appId: "1:112204929962:web:36c7ecc91d73c39845e9d3",
    measurementId: "G-RDWFW0X8MD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore();

export { app, auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, db};