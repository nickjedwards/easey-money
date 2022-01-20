import { ec as EC } from "elliptic"
import Blockchain from "./Blockchain"
import Transaction from "./Transaction"

// Sender: Nick
const sender: EC.KeyPair = new EC('secp256k1')
    .keyFromPrivate('7f0b629cbb9d794b3daf19fcd686a30a039b47395545394dadc0574744996a87')

// Receiver: Prutha
const receiver: EC.KeyPair = new EC('secp256k1')
    .keyFromPrivate('e07d3bded5865085645f75a5d226084ef099ac0e8e18d2fbeea617a02b811327')

// Create a new blockchain
const blockchain: Blockchain = new Blockchain()

console.log(`Nick's balance: ${blockchain.getBalanceOfAddress(sender.getPublic('hex'))}`)
console.log(`Pruthas's balance: ${blockchain.getBalanceOfAddress(receiver.getPublic('hex'))}`)

console.log('Nick sends 50 thingies to Prutha...')

// Create a new pending transaction to be mined and pushed onto the blockchain
const transaction: Transaction = new Transaction(sender.getPublic('hex'), receiver.getPublic('hex'), 50)
// Sign the transaction with the sender's key
transaction.sign(sender)

// Push the transaction into the blockchain. Ready for mining
blockchain.addTransaction(transaction)

// Custom application code before mining transactions...

console.log('Prutha mines the next block...')

// "Mine" the validated transactions and push the mined block onto the blockchain
blockchain.mineTransactions(receiver.getPublic('hex'))

// Add a couple more transactions onto the blockchain
// const t2: Transaction = new Transaction(receiver.getPublic('hex'), sender.getPublic('hex'), 50)
// t2.sign(receiver)

// const t3: Transaction = new Transaction(receiver.getPublic('hex'), sender.getPublic('hex'), 1)
// t3.sign(receiver)

// blockchain.addTransaction(t2)
// blockchain.addTransaction(t3)

// blockchain.mineTransactions(sender.getPublic('hex'))

console.log(`Nick's new balance: ${blockchain.getBalanceOfAddress(sender.getPublic('hex'))}`)
console.log(`Pruthas's new balance: ${blockchain.getBalanceOfAddress(receiver.getPublic('hex'))}`)

// What does the blockchain look like?
// console.log(JSON.stringify(blockchain, null, 4))
