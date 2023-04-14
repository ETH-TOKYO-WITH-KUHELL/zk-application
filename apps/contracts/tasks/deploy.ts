import { task, types } from "hardhat/config"

task("deploy", "Deploy a Feedback contract")
    .addOptionalParam("semaphore", "Semaphore contract address", undefined, types.string)
    .addOptionalParam("group", "Group id", "42", types.string)
    .addOptionalParam("nft", "NFT contract address", undefined, types.string)
    .addOptionalParam("logs", "Print the logs", true, types.boolean)
    .setAction(async ({ logs, semaphore: semaphoreAddress, group: groupId, nft: nftAddress }, { ethers, run }) => {
        if (!semaphoreAddress) {
            const { semaphore } = await run("deploy:semaphore", {
                logs
            })

            semaphoreAddress = semaphore.address
        }

        if (!groupId) {
            groupId = process.env.GROUP_ID
        }

        if (!nftAddress) { // default value = 0xF268C79d48E168d09e2e3A406b5E85337C39d226 ( 예전에 사용했던 nft contract )
            nftAddress = process.env.NFT_CONTRACT_ADDRESS
        }

        const FeedbackFactory = await ethers.getContractFactory("Feedback")

        const feedbackContract = await FeedbackFactory.deploy(semaphoreAddress, groupId, nftAddress)

        await feedbackContract.deployed()

        if (logs) {
            console.info(`Feedback contract has been deployed to: ${feedbackContract.address} with NFT contract : ${nftAddress}` )
        }

        return feedbackContract
    })
