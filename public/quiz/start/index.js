import { onAuthStateChanged, auth } from '../../index.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.6.3/firebase-firestore.js'

const db = getFirestore();

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location = '../../account/login';
    }
})

let userResponse = [];
let quizQuestionData = null;
getData();


async function getData() {
    const params = new URLSearchParams(window.location.search);
    if (params.has("id")) {
        const quizId = params.get("id");
        quizQuestionData = JSON.parse(sessionStorage.getItem(quizId));
        if (quizQuestionData == null) {
            quizQuestionData = await getDataFromServer(quizId);
        }
        addQuestionControl();
        moveQuestion(0);
    }
}

async function getDataFromServer(quizId) {
    const docRef = doc(db, 'testQuestions', quizId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        sessionStorage.setItem(quizId, JSON.stringify(docSnap.data()));
        getData();
    } else {
        console.log("No such document!");
    }
}

function addQuestionControl() {
    const container = document.getElementById('questionControl');
    for (let i = 0; i < quizQuestionData.question.length; i++) {
        const div = document.createElement("div");
        div.style.width = '60px';
        div.style.height = '60px';
        div.style.color = 'white';
        div.style.background = '#ccc';
        div.style.textAlign = 'center';
        div.style.lineHeight = '60px';
        div.style.cursor = 'pointer';
        div.style.verticalAlign = 'middle';
        div.style.borderRadius = '6px';
        div.id = 'quesGrid-' + i;
        div.textContent = i + 1;

        div.addEventListener('click', () => moveQuestion(i));

        container.appendChild(div);
        container.style.visibility = 'visible';
        const minutes = 25;
        controlTimer(minutes);
    }
}

function saveAndNext(which) {
    const option = document.getElementsByTagName('input');
    for (let i = 0; i < option.length; i++) {
        if (option[i].checked) {
            let element = {};
            element['which'] = which;
            element['selected'] = i;
            let duplicate = false;
            for (let j = 0; j < userResponse.length; j++) {
                if (userResponse[j].which === which) {
                    userResponse[j].selected = i;
                    duplicate = true;
                    break;
                }
            }
            if (!duplicate) userResponse.push(element);
            moveQuestion(which + 1);
            return;
        }
    }
    moveQuestion(which + 1);
}


document.getElementById('submitBtn').addEventListener('click', finalSubmit);
document.getElementById('finalSubmitBtn').addEventListener('click', finalSubmit);

function finalSubmit() {
    let userScore = 0;
    for (let i = 0; i < userResponse.length; i++) {
        if (quizQuestionData.question[userResponse[i].which].answer === userResponse[i].selected) {
            userScore += quizQuestionData.question[userResponse[i].which].mark;
        }
    }
    const totalScore = quizQuestionData.totalMarks;
    const data = { userScore: userScore, totalScore: totalScore };
    sessionStorage.setItem('resultData', JSON.stringify(data));
    window.location.replace('../result');
}

document.getElementById('exitBtn').addEventListener('click', () => {
    location.replace('../explore');
})

document.getElementById('nextBtn').addEventListener('click', (event) => {
    saveAndNext(parseInt(document.getElementById(event.target.id).getAttribute("which")));
})

document.getElementById('prevBtn').addEventListener('click', (event) => {
    moveQuestion(document.getElementById(event.target.id).getAttribute("which") - 1);
})


function controlTimer(minutes) {
    const timer = document.getElementById('timer');
    timer.textContent = `Time Left: 00:${minutes}:00`;
}


function moveQuestion(which) {
    if (which === quizQuestionData.question.length) {
        document.getElementById('finalSubmit').style.display = 'block';
        document.getElementById('actionBtns').style.display = 'none';
    }
    else {
        document.getElementById('actionBtns').style.display = 'block';
        document.getElementById('finalSubmit').style.display = 'none';
    }

    if (which >= quizQuestionData.question.length || which < 0) {
        return;
    }


    const quesNumber = document.getElementById("quesNumber");
    quesNumber.textContent = `Question ${which + 1}.`;

    const quesTitle = document.getElementById("quesTitle");
    quesTitle.textContent = quizQuestionData.question[which].title;


    document.getElementById('option1').textContent = quizQuestionData.question[which].options[0];
    document.getElementById('option2').textContent = quizQuestionData.question[which].options[1];
    document.getElementById('option3').textContent = quizQuestionData.question[which].options[2];
    document.getElementById('option4').textContent = quizQuestionData.question[which].options[3];
    document.getElementsByClassName('actionBtn')[0].style.display = 'inline-block';
    document.getElementsByClassName('actionBtn')[1].style.display = 'inline-block';

    const option = document.getElementsByTagName('input');
    for (let i = 0; i < option.length; i++) {
        option[i].checked = false;
    }

    document.getElementById("nextBtn").setAttribute("which", which);
    document.getElementById("prevBtn").setAttribute("which", which);

}