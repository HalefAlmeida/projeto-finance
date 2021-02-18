
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyDLIQaxvJzFkQprpSzK50dLyj3PTWKoHT8",
    authDomain: "projeto-finance.firebaseapp.com",
    projectId: "projeto-finance",
    storageBucket: "projeto-finance.appspot.com",
    messagingSenderId: "739464442513",
    appId: "1:739464442513:web:004e717889899157668530",
    measurementId: "G-CNDYQXKBXZ"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
firebase.analytics();

console.log(db);

function addData() {
    db.collection("lancamentos").add({
        first: "Ada",
        last: "Lovelace",
        born: 1815
    })
        .then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
        });
};

addData();