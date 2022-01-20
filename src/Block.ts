import crypto from "crypto";
import Transaction from "./Transaction";

export default class Block {
    /**
     * The block's hash.
     */
    public hash: string

    /**
     * The iterations taken during the proof of work.
     */
    private nonce: number = 0

    public constructor(protected timestamp: number, public transactions: Transaction[], public previousHash="") {
        this.hash = this.createHash()
    }

    /**
     * Proof of work.
     * Continuously hash the block until it's hash digest start with the number of `difficulty` zeros.
     *
     * @param difficulty
     */
    public mineBlock(difficulty: number) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
            this.nonce++;
            this.hash = this.createHash();
        }

        console.info(`Block mined: ${this.hash}`);
    }

    /**
     * Generate the block's hash using the transactional payload.
     *
     * @returns string
     */
    public createHash(): string {
        return crypto.createHash("sha256")
            .update(this.timestamp + JSON.stringify(this.transactions) + this.previousHash + this.nonce)
            .digest('hex')
    }
}
