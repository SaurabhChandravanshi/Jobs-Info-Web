import {auth, signInWithEmailAndPassword, onAuthStateChanged} from  '../../index.js';


document.getElementById('loginBtn').addEventListener('click', signInUser);
const messageBox = document.getElementById('messageBox');

function signInUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log("Auth Success", user);

        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            messageBox.style.display = 'block';
            messageBox.textContent = 'Login Failed: Either Email and Password mismatched or User does not exist.';
            console.log("Auth Failed", errorCode, errorMessage);
        });
}


onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location = "../../quiz/explore";
    }
  });