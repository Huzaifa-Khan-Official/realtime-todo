import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getDatabase, 
    ref, 
    set, 
    onValue, 
    push, 
    remove, 
    update 
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

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
// Initialize Realtime Database and get a reference to the service
const db = getDatabase();



const auth = getAuth();

if (!localStorage.getItem("userUid")) {
    location.href = "../signup/signup.html";
}

const getul = document.querySelector(".todoList")
const addLi = document.getElementById("addLi");
const updLiBtn = document.getElementById("updLi");
const delAll = document.getElementById("delAll");
const inputLi = document.getElementById("inp");
const updLiInp = document.getElementById("updInp");
let todoList = document.querySelector(".todoList");
let errorPara = document.querySelector("#errorPara"); // get error paragraph
let upderrorPara = document.querySelector("#upderrorPara"); // get error paragraph
const userUid = localStorage.getItem("userUid");


const getPreviousTodos = async () => {
    const userRef = ref(db, `users/${userUid}/`);
    onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {

            if (data.todo && data) {
                todoList.innerHTML = "";
                delAll.style.display = "block";

                const allTodos = data.todo;

                for (const key in allTodos) {
                    let crrTodoData = allTodos[key].todo;
                    todoList.innerHTML += `
                <li class="todo-item" id="">
                    <div class="listStyle">
                        <i class="fa-regular fa-circle"></i>
                    </div>
                    <div class="todoItemDiv">
                        <div class="todoContent"><p>${crrTodoData}</p></div>
                        <div class="editDelBtns">
                            <div class="editBtn" onclick="editLi(this, '${key}')" data-bs-toggle="modal" data-bs-target="#updModal"><i class="fa-regular fa-pen-to-square"></i></div>
                            <div class="delBtn" onclick="delLi('${key}')"><i class="fa-regular fa-trash-can"></i></div>
                        </div>
                    </div>
                </li>
                `;
                }

            } else {
                todoList.innerHTML = "";
                delAll.style.display = "none";
            }
        }

    })
}

getPreviousTodos();

addLi.addEventListener("click", async () => {
    try {
        const inputLi = document.getElementById("inp");
        const todo = inputLi.value
        if (todo == "") {
            errorPara.innerText = "Please fill input field!";
            setTimeout(() => {
                errorPara.innerHTML = "";
            }, 3000);
        } else {
            $('#addTodoModal').modal('hide');

            set(push(ref(db, `users/${userUid}/todo/`)), {
                todo: todo
            });

        }
    } catch (e) {
        console.error("Error adding document: ", e);
    }
    inputLi.value = "";

})

inputLi.addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        addLi.click()
    }
})


delAll.addEventListener("click", async () => {
    getul.innerHTML = "";
    const delAllTodo = ref(db, `users/${userUid}/todo/`);
    await remove(delAllTodo)

})

async function delLi(id) {
    const delTodo = ref(db, `users/${userUid}/todo/${id}`);
    await remove(delTodo)
}

let updateLi;
let updateLiId;

async function editLi(e, id) {
    let previousTodo = e.parentNode.parentNode.childNodes[1].childNodes[0].textContent;
    updLiInp.value = previousTodo;

    updateLi = e;
    updateLiId = id

}

updLiInp.addEventListener("keypress", (event) => {
    if (event.key == "Enter") {
        updLiFoo(updateLi, updateLiId)
    }
})

updLiBtn.addEventListener("click", () => {
    updLiFoo(updateLi, updateLiId)
})

async function updLiFoo(e, id) {
    let updTodo = updLiInp.value;
    if (updTodo == "") {
        upderrorPara.innerText = "Can not update empty field!";
        setTimeout(() => {
            upderrorPara.innerHTML = "";
        }, 3000);

    } else {

        $('#updModal').modal('hide');
        updLiInp.value = updTodo;
        e.parentNode.parentNode.childNodes[1].childNodes[0].textContent = updTodo;
        const editTodoRef = ref(db, `users/${userUid}/todo/${id}`);

        const editTodo = {
            todo: updTodo
        }

        update(editTodoRef, editTodo)
    }
}

const logout = document.querySelector("#logout");

logout.addEventListener("click", () => {
    auth.signOut().then(() => {
        localStorage.removeItem("userUid");
        location.href = "../signup/signup.html";
    })
})

window.delLi = delLi;
window.editLi = editLi;