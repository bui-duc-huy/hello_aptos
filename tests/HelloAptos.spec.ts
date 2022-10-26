import { AptosAccount, AptosClient, FaucetClient } from "aptos"

const NODE_URL = "https://fullnode.devnet.aptoslabs.com"
const FAUCET_URL = "https://faucet.devnet.aptoslabs.com"

class HelloAptosClient extends AptosClient {
    constructor() {
        super(NODE_URL)
    }

    async setMessage(messageHolder: AptosAccount, message: string): Promise<string> {
        const rawTx = await this.generateTransaction(messageHolder.address(), {
            function: "0x1b0031c5695b1745262577f7a5989e22d1ec6683edf6569b9d0818781b45db50::message::set_message",
            type_arguments: [],
            arguments: [message]
        })
        
        const bscTx = await this.signTransaction(messageHolder, rawTx)

        const pendingTx = await this.submitTransaction(bscTx)
        return pendingTx.hash
    }
}

describe("Hello Aptos", () => {
    let client: HelloAptosClient
    let faucetClient: FaucetClient
    let mainAccount: AptosAccount

    before("Create Connection", async () => {
        client = new HelloAptosClient;
        faucetClient = new FaucetClient(NODE_URL, FAUCET_URL)
        mainAccount = new AptosAccount()

        await faucetClient.fundAccount(mainAccount.address(), 100_000_000)
    })

    it("Test Message", async () => {
        const txHash = await client.setMessage(mainAccount, "hello world")
        await client.waitForTransaction(txHash, { checkSuccess: true })
        console.log("Transaction success", txHash)
    })
})
