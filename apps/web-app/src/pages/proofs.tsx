import { Box, Button, Divider, HStack, Text, useBoolean, VStack } from "@chakra-ui/react"
import { Group } from "@semaphore-protocol/group"
import { Identity } from "@semaphore-protocol/identity"
import { generateProof } from "@semaphore-protocol/proof"
import { BigNumber, ethers, providers, utils } from "ethers"
import getNextConfig from "next/config"
import { useRouter } from "next/router"
import { useCallback, useContext, useEffect, useState } from "react"
import Feedback from "../../contract-artifacts/Feedback.json"
import Stepper from "../components/Stepper"
import LogsContext from "../context/LogsContext"
import SemaphoreContext from "../context/SemaphoreContext"
import IconAddCircleFill from "../icons/IconAddCircleFill"
import IconRefreshLine from "../icons/IconRefreshLine"

const { publicRuntimeConfig: env } = getNextConfig()

export default function ProofsPage() {
    const router = useRouter()
    const { setLogs } = useContext(LogsContext)
    const { _users, _feedback, refreshFeedback, addFeedback } = useContext(SemaphoreContext)
    const [_loading, setLoading] = useBoolean()
    const [_identity, setIdentity] = useState<Identity>()

    useEffect(() => {
        const identityString = localStorage.getItem("identity")

        if (!identityString) {
            router.push("/")
            return
        }

        setIdentity(new Identity(identityString))
    }, [])

    useEffect(() => {
        if (_feedback.length > 0) {
            setLogs(`${_feedback.length} feedback retrieved from the group 🤙🏽`)
        }
    }, [_feedback])

    const sendFeedback = useCallback(async () => {
        if (!_identity) {
            return
        }

        const feedback = prompt("Please enter your feedback:")

        if (feedback && _users) {
            setLoading.on()

            setLogs(`Posting your anonymous feedback...`)

            try {
                const group = new Group(env.GROUP_ID)

                const signal = BigNumber.from(utils.formatBytes32String(feedback)).toString()

                group.addMembers(_users)

                const { proof, merkleTreeRoot, nullifierHash } = await generateProof(
                    _identity,
                    group,
                    env.GROUP_ID,
                    signal
                )

                if (window.ethereum) {
                    await window.ethereum.enable()
                    const provider = new providers.Web3Provider(window.ethereum)
                    await provider.send("eth_requestAccounts", [])
                    const signer = provider.getSigner()
                    const contract = new ethers.Contract(env.FEEDBACK_CONTRACT_ADDRESS, Feedback.abi, signer)
                    const transaction = await contract.sendFeedback(signal, merkleTreeRoot, nullifierHash, proof)
                    await transaction.wait()
                    addFeedback(feedback)
                    setLogs(`Your feedback was posted 🎉`)
                }
            } catch (error) {
                console.error(error)
                setLogs("you can make a feedback once!")
            } finally {
                setLoading.off()
            }
        }
    }, [_identity])

    return (
        <>
            <HStack py="5" justify="space-between">
                <Text fontWeight="bold" fontSize="lg">
                    Feedback signals ({_feedback.length})
                </Text>
                <Button leftIcon={<IconRefreshLine />} variant="link" color="text.700" onClick={refreshFeedback}>
                    Refresh
                </Button>
            </HStack>

            <Box pb="5">
                <Button
                    w="100%"
                    fontWeight="bold"
                    justifyContent="left"
                    colorScheme="primary"
                    px="4"
                    onClick={sendFeedback}
                    isDisabled={_loading}
                    leftIcon={<IconAddCircleFill />}
                >
                    Send Feedback
                </Button>
            </Box>

            {_feedback.length > 0 && (
                <VStack spacing="3" align="left">
                    {_feedback.map((f, i) => (
                        <HStack key={i} p="3" borderWidth={1}>
                            <Text>{f}</Text>
                        </HStack>
                    ))}
                </VStack>
            )}

            <Divider pt="6" borderColor="gray" />

            <Stepper step={3} onPrevClick={() => router.push("/groups")} />
        </>
    )
}
