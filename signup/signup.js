import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";

import {
  getDatabase,
  ref,
  set,
  onValue,
  push,
  remove,
  update
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDKbcJ3CVh0M6_MnGQjF2Iw_LmskUabrdE",
  authDomain: "fir-todo-5ed69.firebaseapp.com",
  projectId: "fir-todo-5ed69",
  storageBucket: "fir-todo-5ed69.appspot.com",
  messagingSenderId: "70260766093",
  appId: "1:70260766093:web:5ec9b1faef82084c2df9c4",
  databaseURL: "https://fir-todo-5ed69-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

const app = initializeApp(firebaseConfig);

const db = getDatabase();

const provider = new GoogleAuthProvider();

const auth = getAuth();

let sbtn = document.querySelector("#sbtn"); // get signin btn
let errorPara = document.querySelector("#errorPara"); // get error paragraph

sbtn.addEventListener("click", () => {
  let semail = document.querySelector("#semail"); // get email to signin user
  let spassword = document.querySelector("#spassword"); // get password to signin user
  let sname = document.querySelector("#sname"); // get name of a user

  if (sname.value == "") {
    errorPara.innerText = "Please fill name field!";
    setTimeout(() => {
      errorPara.innerHTML = "";
    }, 3000);
  } else {
    // storing data in a array
    let userData = {
      sname: sname.value,
      semail: semail.value,
      spassword: spassword.value,
    };
    // creating user with eamil and password
    createUserWithEmailAndPassword(auth, userData.semail, userData.spassword)
      // email value  , password value
      .then(async (userCredential) => {
        const user = userCredential.user; // getting user from firebase
        // user.uid "user unique id"

        await set(ref(db, `/users/${user.uid}`), {
          sname: sname.value,
          semail: semail.value,
          spassword: spassword.value,
        });

        location.href = "../login/login.html";
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = errorCode.slice(5).toUpperCase();
        const errMessage = errorMessage.replace(/-/g, " ");
        errorPara.innerText = errMessage;
        setTimeout(() => {
          errorPara.innerHTML = "";
        }, 3000);
      });
  }
});

spassword.addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    sbtn.click();
  }
});

const googleSignInBtn = document.getElementById("googleSignInBtn");

googleSignInBtn.addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then(async (result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      const user = result.user;

      await set(ref(db, `/users/${user.uid}`), {
        sname: user.displayName,
        semail: user.email,
      });

      localStorage.setItem("userUid", user.uid);

      location.href = "../index.html";
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);

      if (email) {
        errorPara.innerText = email;
        setTimeout(() => {
          errorPara.innerHTML = "";
        }, 3000);
      }
    });
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    const userUid = user.uid;
  } else {
    localStorage.removeItem("userUid");
  }
});

if (localStorage.getItem("userUid")) {
  location.href = "../index.html";
}
