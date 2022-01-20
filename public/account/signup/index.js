import { auth, onAuthStateChanged, db, createUserWithEmailAndPassword } from '../../index.js';

onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location = '../../quiz/explore';
    }
});

const messageBox = document.getElementById('messageBox');
document.getElementById("createAccount").addEventListener('click', createAccount);

function createAccount() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            updateUser(user);
            messageBox.style.display = 'block';
            messageBox.textContent = 'Please wait while we are creating an account for you.';
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            messageBox.style.display = 'block';
            messageBox.textContent = 'Failed to create account Please try again.';
            console.log("Signup Error", errorCode, errorMessage);
        });
}

function updateUser(user) {
    const email = document.getElementById('email');
    const name = document.getElementById('name');
    const userData = {
        name: name,
        email: email
    }
    db.collection("users").add(userData)
        .then((docRef) => {
            window.location = '../login';
        })
        .catch((err) => {
            messageBox.style.display = 'block';
            messageBox.textContent = 'Failed to create account Please try again.';
            console.log("DB error", err.errorMessage);
        });
}