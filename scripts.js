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

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },

    set(transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions));

    }
}

//TODO: Implementar CRUD Firestore
const Transaction = {
    all: Storage.get(),

    add(transaction) {
        Transaction.all.push(transaction)

        //Persiste objeto no firestore
        db.collection("lancamentos").add(Object.assign({}, transaction))
            .then(function (docRef) {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
            });
        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1)

        App.reload()
    },
    create() {

    },

    read() {

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
            console.log(transaction);
            Transaction.add(transaction);
            Form.clearFields()
            Modal.close()
        } catch (error) {
            alert(error.message)
        }
    }
},
    App = {
        init() {
            Transaction.all.forEach(DOM.addTransaction)

            DOM.updateBalance()

            Storage.set(Transaction.all)

        },
        reload() {
            DOM.clearTransactions()
            App.init()
        },
    }

App.init()