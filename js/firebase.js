// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDLIQaxvJzFkQprpSzK50dLyj3PTWKoHT8",
  authDomain: "projeto-finance.firebaseapp.com",
  projectId: "projeto-finance",
  storageBucket: "projeto-finance.appspot.com",
  messagingSenderId: "739464442513",
  appId: "1:739464442513:web:004e717889899157668530",
  measurementId: "G-CNDYQXKBXZ",
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)
var db = firebase.firestore()

const firestore = {
  /**
   *
   * @param {*} transaction Transação a ser persistida no Firestore
   */
  create(transaction) {
    let documentRef = db.collection("lancamentos").doc()

    transaction = Object.assign({ id: documentRef.id }, transaction)

    //Persiste objeto no firestore
    documentRef
      .set(transaction)
      .then(function (docRef) {
        console.log("Document written!")
      })
      .catch(function (error) {
        console.error("Error adding document: ", error)
      })

    Transaction.add(documentRef)
  },

  /**
   *
   * @param {*} collection Coleção firestore de onde os documentos serão recuperados
   */
  read(collection) {
    let query = []

    db.collection(collection)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          query.push(doc.data())
        })
      })

    return query
  },

  /**
   *
   * @param {*} collection Coleção firestore em que o documento será buscado por id
   * @param {*} id Identificador do registro a ser recuperado
   */
  readById(collection, id) {
    let dbRef = db.collection(collection).get(id)
    dbRef
      .get()
      .then(function (doc) {
        if (doc.exists) {
          return "oii"
        } else {
          return "hmmm"
        }
      })
      .catch(function (error) {
        console.log("Erro recuperando documentos: " + error)
      })
  },

  update(transaction) {},

  delete(collection, transaction) {
    db.collection(collection)
      .doc(transaction.id)
      .delete()
      .then(function () {
        console.log("Document successfully deleted!")
      })
      .catch(function (error) {
        console.error("Error removing document: ", error)
      })
  },
}

module.exports = {
  firestore,
}
