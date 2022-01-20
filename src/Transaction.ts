import { ec as EC } from "elliptic"
import crypto from "crypto"

export default class Transaction {
    /**
     * The time of the transaction.
     */
    protected timestamp: number

    /**
     * The signed digest.
     */
    protected signature?: string | null

    public constructor(public sender: null|string, public recipient: string, public amount: number) {
        this.timestamp = Date.now()
    }

    /**
     * Generate the transaction's hash using it's payload.
     *
     * @returns string
     */
    public createHash(): string {
        return crypto.createHash("sha256")
            .update(this.sender + this.recipient + this.amount + this.timestamp)
            .digest('hex')
    }

    /**
     * Sign the payload's hash digest with the (sender's) key.
     *
     * @param signingKey
     */
    public sign(signingKey: EC.KeyPair) {
        if (signingKey.getPublic('hex') !== this.sender) {
            throw new Error('You cannot sign transactions for others!')
        }

        this.signature = signingKey.sign(this.createHash(), "base64").toDER("hex")
    }

    /**
     * Validate the transaction has not been altered.
     * If it has, it's hash digest will be different invalidating the signature.
     *
     * @returns boolean
     */
    public isValid(): boolean {
        if (this.sender === null) {
            return true;
        }

        if (!this.signature || this.signature.length === 0) {
            throw new Error('No signature in this transaction')
        }

        return new EC('secp256k1')
            .keyFromPublic(this.sender, 'hex')
            .verify(this.createHash(), this.signature)
    }
}
