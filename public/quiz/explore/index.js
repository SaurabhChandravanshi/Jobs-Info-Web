import { auth, onAuthStateChanged } from '../../index.js';


onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location = '../../account/login';
    }
});

const featuredBox = document.getElementsByClassName('featured-box');

Array.from(featuredBox).forEach((element) => {
    element.addEventListener('click', handleFBoxClick);
})

function handleFBoxClick() {
    const params = this.getAttribute('data-params').split('&');
    window.location.href = `../browse?ie=${params[0]}&c=${params[1]}`;
}

document.getElementById('logoutBtn').addEventListener('click', () => auth.signOut());