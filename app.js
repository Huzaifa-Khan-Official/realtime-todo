import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    deleteUser
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

import {
    getDatabase,
    ref,
    set,
    onValue,
    push,
    remove,
    update
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDKbcJ3CVh0M6_MnGQjF2Iw_LmskUabrdE",
    authDomain: "fir-todo-5ed69.firebaseapp.com",
    projectId: "fir-todo-5ed69",
    storageBucket: "fir-todo-5ed69.appspot.com",
    messagingSenderId: "70260766093",
    appId: "1:70260766093:web:5ec9b1faef82084c2df9c4",
    databaseURL: "https://fir-todo-5ed69-default-rtdb.asia-southeast1.firebasedatabase.app/"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();
// Initialize Cloud Firestore and get a reference to the service
const db = getDatabase();

let usersName;
let usersEmail;
let usersRef;

// get usernameDiv
const usernameDiv = document.querySelector('#uptName');
// get useremailDiv
const useremailDiv = document.querySelector('#uptEmail');

if (!localStorage.getItem("userUid")) {
    location.href = "../signup/signup.html"
}

onAuthStateChanged(auth, async (user) => {
    if (user) {
        localStorage.setItem("userUid", user.uid);
        const userRef = ref(db, `users/${user.uid}/`);
        onValue(userRef, (snapshot) => {
            const data = snapshot.val();

            let userName = data.sname;
            let nameFirstLetter = userName.slice(0, 1).toUpperCase();
            let nameRemainLetters = userName.slice(1).toLowerCase();
            userName = nameFirstLetter + nameRemainLetters

            usersName = userName; // get the user name
            usersEmail = data.semail; // get the user name 

            usernameDiv.value = usersName
            useremailDiv.value = usersEmail
        })

    } else {
        localStorage.removeItem("userUid")
        location.href = "../signup/signup.html";
    }
});

const logout = document.querySelector("#logout");

logout.addEventListener("click", () => {
    auth.signOut().then(() => {
        localStorage.removeItem("userUid")
        location.href = "../signup/signup.html";
    })
})


// get updBtn
const updBtn = document.querySelector('#updBtn');
// get errorPara
const errorPara = document.querySelector('#errorPara');
// get successPara
const successPara = document.querySelector('#successPara');
// get delBtn
const delBtn = document.querySelector('#delBtn');


const userUid = localStorage.getItem("userUid");

updBtn.addEventListener("click", async () => {
    if (usernameDiv.value == "") {
        errorPara.innerText = "Please fill the name field";
        setTimeout(() => {
            errorPara.innerHTML = "";
        }, 3000);
    } else if (usernameDiv.value == usersName) {
        errorPara.innerText = "Can not update previous name";
        setTimeout(() => {
            errorPara.innerHTML = "";
        }, 3000);
    } else {
        const upedName = usernameDiv.value;
        try {
            const updNameRef = ref(db, `users/${userUid}/`);

            const editTodo = {
                sname: upedName
            }

            update(updNameRef, editTodo)

            successPara.innerText = "Successfully Updated!";
            setTimeout(() => {
                successPara.innerHTML = "";
            }, 3000);
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = errorCode.slice(5).toUpperCase();
            const errMessage = errorMessage.replace(/-/g, " ")
            errorPara.innerText = errMessage;
            setTimeout(() => {
                errorPara.innerHTML = "";
            }, 3000);
        }
    }
});


delBtn.addEventListener("click", () => {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
        if (result.isConfirmed) {
            const delAccount = ref(db, `users/${userUid}`);
            await remove(delAccount);

            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    localStorage.removeItem("userUid")
                    deleteUser(user).then(async () => {

                    }).catch((error) => {
                        errorPara.innerText = "Oops! Something went wrong.";
                        setTimeout(() => {
                            errorPara.innerHTML = "";
                        }, 3000);
                    });
                    console.log(user);
                    location.href = "../signup/signup.html"

                }
            })
        }
    });
})