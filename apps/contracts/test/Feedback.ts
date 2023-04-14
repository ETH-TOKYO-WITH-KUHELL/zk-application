import { Group } from "@semaphore-protocol/group"
import { Identity } from "@semaphore-protocol/identity"
import { generateProof } from "@semaphore-protocol/proof"
import { expect } from "chai"
import { formatBytes32String } from "ethers/lib/utils"
import { run } from "hardhat"
// @ts-ignore: typechain folder will be generated after contracts compilation
import { Feedback } from "../build/typechain"
import { config } from "../package.json"

describe("Feedback", () => {
    let feedbackContract: Feedback
    let semaphoreContract: string

    const groupId = "42"
    const group = new Group(groupId)
    const nftAddress = process.env.NFT_CONTRACT_ADDRESS
    const users: Identity[] = []

    before(async () => {
        const { semaphore } = await run("deploy:semaphore", {
            logs: false
        })

        feedbackContract = await run("deploy", { logs: false, group: groupId, semaphore: semaphore.address, nft: nftAddress })
        console.log(`      [test] feedbackContract is deployed successfully with ${nftAddress}`)

        semaphoreContract = semaphore

        users.push(new Identity())
        users.push(new Identity())
    })

    describe("# joinGroup", () => {
        it("Should allow users to join the group", async () => {
            console.log('check users array >> ', users.slice((1))) // 0으로 하면 첫 번째 요소까지 루프에서 반복되기 때문에 이전에 가입한 첫 번째 유저가 다시 추가되어 에러 발생
            for await (const [i, user] of users.slice(1).entries()) { // 이전에 가입한 첫 번째 유저를 제외하고 새로운 유저 추가
                const transaction = feedbackContract.joinGroup(user.commitment, formatBytes32String("nickname1"))
                console.log('# joinGroup - user.commitment is ', user.commitment)

                group.addMember(user.commitment)

                await expect(transaction)
                    .to.emit(semaphoreContract, "MemberAdded")
                    .withArgs(groupId, i, user.commitment, group.root)
            }
        })
    })


    describe("# sendFeedback", () => {
        const wasmFilePath = `${config.paths.build["snark-artifacts"]}/semaphore.wasm`
        const zkeyFilePath = `${config.paths.build["snark-artifacts"]}/semaphore.zkey`

        it("Should allow users to send feedback anonymously", async () => {
            const feedback = formatBytes32String("Hello World")

            const fullProof = await generateProof(users[1], group, groupId, feedback, {
                wasmFilePath,
                zkeyFilePath
            })

            const transaction = feedbackContract.sendFeedback(
                feedback,
                fullProof.merkleTreeRoot,
                fullProof.nullifierHash,
                fullProof.proof
            )

            await expect(transaction)
                .to.emit(semaphoreContract, "ProofVerified")
                .withArgs(groupId, fullProof.merkleTreeRoot, fullProof.nullifierHash, groupId, fullProof.signal)
        })
    })

    describe("# getUserInfo", () => {
        it("Should allow user to get each of identityCommitment ", async () => {
            const result = await feedbackContract.getUserInfo(formatBytes32String("nickname1"));
            console.log('# getUserInfo - identityCommitment of user is ', result.toString());
        });
    });
})
