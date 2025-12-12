const firebaseConfig = {
  apiKey: "AIzaSyDTVI_YFEsQCXlhyM7xealR6L5Kyk2oGhc",
  authDomain: "mini-challenge-240d9.firebaseapp.com",
  projectId: "mini-challenge-240d9",
  storageBucket: "mini-challenge-240d9.firebasestorage.app",
  messagingSenderId: "778371606750",
  appId: "1:778371606750:web:37c3ddb9afc91ba9c87a4f",
  measurementId: "G-L93FR9HFDP",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const authForms = document.getElementById("auth-forms");
const userInfo = document.getElementById("user-info");
const userEmailSpan = document.getElementById("user-email");
const postSection = document.getElementById("post-section");
const authError = document.getElementById("auth-error");

auth.onAuthStateChanged((user) => {
  if (user) {
    authForms.classList.add("hidden");
    userInfo.classList.remove("hidden");
    postSection.classList.remove("hidden");
    userEmailSpan.textContent = user.email;
    console.log("Test user.email : ", user.email);
  } else {
    authForms.classList.remove("hidden");
    userInfo.classList.add("hidden");
    postSection.classList.add("hidden");
    userEmailSpan.textContent = "";
  }
});

function createUserWithEmailAndPassword() {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  auth.createUserWithEmailAndPassword(email, password).catch((error) => {
    authError.textContent = error.message;
  });
}

function signInWithEmailAndPassword() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  auth.signInWithEmailAndPassword(email, password).catch((error) => {
    authError.textContent = error.message;
  });
}

function signOut() {
  auth.signOut();
}

function postMessage() {
  const content = document.getElementById("message-content").value;
  const user = auth.currentUser;

  if (user && content.trim() !== "") {
    console.log("msg : ", content);
    console.log("user : ", user.email);
    db.collection("messages")
      .add({
        content: content,
        uid: user.uid,
        email: user.email,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        document.getElementById("message-content").value = "";
      })
      .catch((error) => {
        document.getElementById("post-error").textContent = error.message;
      });
  }
}

db.collection("messages")
  .orderBy("timestamp", "desc")
  .onSnapshot(
    (snapshot) => {
      messagesList.innerHTML = "";
      snapshot.forEach((doc) => {
        const data = doc.data();
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message");

        let timeString = "Maintenant";
        if (data.timestamp) {
          timeString = data.timestamp.toDate().toLocaleString();
        }

        messageDiv.innerHTML = `
            <strong>${data.email}</strong> <small>${timeString}</small><br>
            ${data.content}
        `;
        messagesList.appendChild(messageDiv);
      });
    },
    (error) => {
      messagesList.innerHTML = "<p>Erreur de chargement des messages</p>";
    }
  );
