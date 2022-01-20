import { onAuthStateChanged, auth } from '../../index.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.6.3/firebase-firestore.js'

const db = getFirestore();

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location = '../../account/login';
    }
});

filterByLanguage('Hindi'); // Default load..
document.getElementById('langHi').addEventListener('click', () => {
    document.getElementById('langEn').className = 'tab-button';
    document.getElementById('langHi').className = 'tab-button active';
    filterByLanguage('Hindi');
});
document.getElementById('langEn').addEventListener('click', () => {
    document.getElementById('langHi').className = 'tab-button';
    document.getElementById('langEn').className = 'tab-button active';
    filterByLanguage('English');
});


async function getDataFromServer(lang) {
    const params = new URLSearchParams(window.location.search);
    if (params.has("ie") && params.has("c")) {
        const mColl = params.get("ie");
        const mDoc = params.get("c");
        const docRef = doc(db, mColl, mDoc);

        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            localStorage.setItem(mDoc, JSON.stringify(docSnap.data()));
            filterByLanguage(lang);
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    } else {
        console.log("Parameter is invalid");
    }
}

function filterByLanguage(lang) {
    
    const params = new URLSearchParams(window.location.search);
    if (params.has('c')) {
        const mDoc = params.get('c');
        const data = JSON.parse(localStorage.getItem(mDoc));
        const root = document.getElementById('recycler');
        root.textContent = '';

        if(data == null) {
            getDataFromServer(lang);
            return;
        }

        for (let item of data.tests) {
            (function () {
                if (item.language === lang) {
                    const recyclerItem = document.createElement("div");
                    const recyclerTitle = document.createElement('div');
                    const recyclerDesc = document.createElement('div');
                    const subList1 = document.createElement('div');
                    const subList2 = document.createElement('div');
                    const subList3 = document.createElement('div');
                    const subList4 = document.createElement('div');

                    recyclerItem.className = 'recycler-item';
                    recyclerTitle.className = 'recycler-title';
                    recyclerDesc.className = 'recycer-desc';

                    recyclerDesc.subList1 = 'recycler-sublist';
                    recyclerDesc.subList2 = 'recycler-sublist';
                    recyclerDesc.subList3 = 'recycler-sublist';
                    recyclerDesc.subList4 = 'recycler-sublist';

                    recyclerTitle.textContent = item.title;
                    recyclerDesc.textContent = item.description;
                    subList1.textContent = item.language;
                    subList2.textContent = item.date;
                    subList3.textContent = item.quesCount + " Questions";
                    subList4.textContent = item.duration + " Minutes";

                    recyclerItem.appendChild(recyclerTitle);
                    recyclerItem.appendChild(recyclerDesc);
                    recyclerItem.appendChild(subList1);
                    recyclerItem.appendChild(subList2);
                    recyclerItem.appendChild(subList3);
                    recyclerItem.appendChild(subList4);

                    recyclerItem.setAttribute("quiz-id", item.id);

                    recyclerItem.addEventListener('click', () => {
                        window.location = '../start?id='+recyclerItem.getAttribute("quiz-id");
                    });

                    root.appendChild(recyclerItem);
                }
            })();
        }
    }
}
