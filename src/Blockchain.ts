import Block from "./Block"
import Transaction from "./Transaction"

export default class Blockchain {
    /**
     * The block of transactions.
     */
    protected chain: Block[] = []

    /**
     * The immutable payload.
     */
    protected transactions: Transaction[] = []

    /**
     * The cost.
     */
    private difficulty: number = 4

    public constructor() {
        this.chain = [this.createGenesisBlock()]
    }

    /**
     * Get the last mined block on the chain.
     *
     * @returns Block
     */
    public getLatestBlock(): Block {
        return this.chain[this.chain.length - 1]
    }

    /**
     * Add a pending transaction to be mined.
     *
     * @param transaction
     */
    public addTransaction(transaction: Transaction) {
        if (!transaction.sender || !transaction.recipient) {
            throw new Error('Transaction must include a sender and recipient')
        }

        if (transaction.amount <= 0) {
            throw new Error('Transaction amount must be greater than 0');
        }

        this.transactions.push(transaction)
    }

    /**
     * Proof of work.
     * Reward the miner by creating a new transaction for them and their mining effort.
     * Mine the new block.
     *
     * @param miner
     */
    public mineTransactions(miner: string) {
        this.transactions.push(new Transaction(null, miner, 1))

        const block: Block = new Block(Date.now(), this.transactions, this.getLatestBlock().hash)
        block.mineBlock(this.difficulty)

        this.chain.push(block)

        this.transactions = []
    }

    /**
     * Calculate a "wallet's" ballance.
     *
     * @param address
     * @returns number
     */
    public getBalanceOfAddress(address: string): number {
        let balance = 0;

        for (const block of this.chain) {
            for (const transaction of block.transactions) {
                if (transaction.sender === address) {
                    balance -= transaction.amount;
                }

                if (transaction.recipient === address) {
                    balance += transaction.amount;
                }
            }
        }

        return balance;
    }

    /**
     * Validate the blockchain.
     *
     * @returns boolean
     */
    public isChainValid(): boolean {
        const realGenesis = JSON.stringify(this.createGenesisBlock())

        if (realGenesis !== JSON.stringify(this.chain[0])) {
            return false
        }

        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i]
            const previousBlock = this.chain[i - 1]

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false
            }

            if (currentBlock.hash !== currentBlock.createHash()) {
                return false
            }
        }

        return true
    }

    /**
     * Create the genesis (first) block on the blockchain.
     *
     * @returns Block
     */
    protected createGenesisBlock() {
        // Nick's public key
        const hash = '04776e087a33444299de7e4a75e540c1e90de24c0650d17470b4c693f0391cb43ad7d49164161b52efb222637ccced580b89f81a56ca87df86a44860dbc1a04e1f'

        return new Block(Date.parse('1991-06-05'), [
            new Transaction(null, hash, 100),
        ])
    }
}
