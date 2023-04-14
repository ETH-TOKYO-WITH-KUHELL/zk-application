import { Contract, providers, Wallet } from "ethers"
import type { NextApiRequest, NextApiResponse } from "next"
import Feedback from "../../../contract-artifacts/Feedback.json"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (typeof process.env.FEEDBACK_CONTRACT_ADDRESS !== "string") {
        throw new Error("Please, define FEEDBACK_CONTRACT_ADDRESS in your .env file")
    }

    if (typeof process.env.DEFAULT_NETWORK !== "string") {
        throw new Error("Please, define DEFAULT_NETWORK in your .env file")
    }

    if (typeof process.env.INFURA_API_KEY !== "string") {
        throw new Error("Please, define INFURA_API_KEY in your .env file")
    }

    if (typeof process.env.POLYGON_PRIVATE_KEY !== "string") {
        throw new Error("Please, define POLYGON_PRIVATE_KEY in your .env file")
    }

    const polygonPrivateKey = process.env.POLYGON_PRIVATE_KEY
    const polygonNetwork = process.env.DEFAULT_NETWORK
    const infuraApiKey = process.env.INFURA_API_KEY
    const contractAddress = process.env.FEEDBACK_CONTRACT_ADDRESS

    const provider = new providers.InfuraProvider(polygonNetwork, infuraApiKey)

    // 서명권한을 env 내부 private_key말고 유저에게 줘야함
    const signer = new Wallet(polygonPrivateKey, provider)
    const contract = new Contract(contractAddress, Feedback.abi, signer)

    const { feedback, merkleTreeRoot, nullifierHash, proof } = req.body

    console.log('feedback>>',feedback)

    try {
        const transaction = await contract.sendFeedback(feedback, merkleTreeRoot, nullifierHash, proof)

        await transaction.wait()

        res.status(200).end()
    } catch (error: any) {
        console.error(error)

        res.status(500).end()
    }
}
