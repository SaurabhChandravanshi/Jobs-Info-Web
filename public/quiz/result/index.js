const resultData = JSON.parse(sessionStorage.getItem("resultData"));


const userScore = resultData.userScore;
const totalScore = resultData.totalScore;

document.getElementById('score').textContent = `Score: ${userScore} / ${totalScore}`;


