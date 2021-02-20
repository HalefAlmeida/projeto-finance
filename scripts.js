// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
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

const Modal = {
    open() {
        // Abrir modal
        // Adicionar a class active ao modal
        document
            .querySelector('.modal-overlay')
            .classList
            .add('active')

    },
    close() {
        // fechar o modal
        // remover a class active do modal
        document
            .querySelector('.modal-overlay')
            .classList
            .remove('active')
    }
}

const Firebase = {
    /**
     * 
     * @param {*} transaction Transação a ser persistida no Firestore
     */
    create(transaction) {
        let documentRef = db.collection("lancamentos").doc();

        transaction = Object.assign({ id: documentRef.id }, transaction)

        //Persiste objeto no firestore
        documentRef.set(transaction)
            .then(function (docRef) {
                console.log("Document written!");
            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
            });

        Transaction.add(documentRef)
    },

    /**
     * 
     * @param {*} collection Coleção firestore de onde os documentos serão recuperados
     */
    read(collection) {
        let query = [];

        db.collection(collection).get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                // doc.data() is never undefined for query doc snapshots
                query.push(doc.data())
            });
        });

        return query
    },

    /**
     * 
     * @param {*} collection Coleção firestore em que o documento será buscado por id
     * @param {*} id Identificador do registro a ser recuperado 
     */
    readById(collection, id) {
        let dbRef = db.collection(collection).get(id);
        dbRef.get().then(function (doc) {
            if (doc.exists) {
                return 'oii'
            } else {
                return 'hmmm'
            }
        }).catch(function (error) {
            console.log("Erro recuperando documentos: " + error);
        })
    },

    update(transaction) {

    },

    delete(collection, transaction) {
        db.collection(collection).doc(transaction.id).delete().then(function () {
            console.log("Document successfully deleted!");
        }).catch(function (error) {
            console.error("Error removing document: ", error);
        });
    }
}

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },

    getWithFirebase(collection) {
        return Firebase.read(collection)
    },

    set(transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions));
    },


    setWithFirebase(collection) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(Firebase.read(collection)));
        Transaction.all.forEach(DOM.addTransaction)
    }
}

//TODO: Implementar CRUD Firestore
const Transaction = {
    all: Storage.getWithFirebase('lancamentos'),

    add(transaction) {
        Transaction.all.push(transaction); // Inclui item no armazenamento local

        App.reload()
    },

    remove(index) {

        Transaction.all.forEach(transaction => {
            if (Transaction.all[index].id == transaction.id) {
                Firebase.delete('lancamentos', transaction)
            }
        })
        Transaction.all.splice(index, 1) // Remove item do armazenamento local

        App.reload()
    },

    incomes() {
        let income = 0;
        Transaction.all.forEach(transaction => {
            if (transaction.amount > 0) {
                income += transaction.amount;
            }
        })
        return income;
    },

    expenses() {
        let expense = 0;
        Transaction.all.forEach(transaction => {
            if (transaction.amount < 0) {
                expense += transaction.amount;
            }
        })
        return expense;
    },

    total() {
        return Transaction.incomes() + Transaction.expenses();
    }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction, index) {

        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)


        const html = `
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td>
            <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
        </td>
        `

        return html
    },

    updateBalance() {
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {
    formatAmount(value) {
        value = Number(value.replace(/\,\./g, "")) * 100

        return value
    },

    formatDate(date) {
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    }
}

const Form = {

    transactionRef: {
        description: document.querySelector('input#description'),
        amount: document.querySelector('input#amount'),
        date: null,
    },

    create() {

    },

    getValues() {
        return {
            description: Form.transactionRef.description.value,
            amount: Form.transactionRef.amount.value,
            date: Date()
        }
    },

    validateFields() {
        const { description, amount } = Form.getValues()

        if (description.trim() === "" ||
            amount.trim() === "") {
            throw new Error("Por favor, preencha todos os campos")
        }
    },

    formatValues() {
        let { description, amount } = Form.getValues()

        amount = Utils.formatAmount(amount)

        // date = Utils.formatDate(date)

        return {
            description,
            amount
        }
    },

    clearFields() {
        Form.transactionRef.description.value = ""
        Form.transactionRef.amount.value = ""
        // Form.date.value = "" // Implementada gravação automática de data
    },

    submit(event) {
        event.preventDefault()

        try {
            Form.validateFields()
            const transaction = Form.formatValues()
            // Transaction.add(transaction);
            Firebase.create(transaction)
            Form.clearFields()
            Modal.close()
        } catch (error) {
            alert(error.message)
        }
    }
},
    App = {
        init() {

            Storage.setWithFirebase('lancamentos')

            DOM.updateBalance()



        },
        reload() {
            //TODO: PROBLEMA - Aplicação não atualiza automaticamente registros do firestore ao inicializar. Remover armazenamento local;
            DOM.clearTransactions()
            App.init()
        },
    }

App.init()