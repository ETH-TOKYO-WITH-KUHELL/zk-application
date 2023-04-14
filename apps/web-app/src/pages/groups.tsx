import { ethers } from "ethers"
import { Box, Button, Divider, Heading, HStack, Link, Text, useBoolean, VStack } from "@chakra-ui/react"
import { Identity } from "@semaphore-protocol/identity"
import getNextConfig from "next/config"
import { useRouter } from "next/router"
import { useCallback, useContext, useEffect, useState } from "react"
import Feedback from "../../contract-artifacts/Feedback.json"
import Stepper from "../components/Stepper"
import LogsContext from "../context/LogsContext"
import SemaphoreContext from "../context/SemaphoreContext"
import IconAddCircleFill from "../icons/IconAddCircleFill"
import IconRefreshLine from "../icons/IconRefreshLine"
import { providers } from "ethers"

const { publicRuntimeConfig: env } = getNextConfig()

declare global {
    interface Window {
        ethereum?: any
    }
}

export default function GroupsPage() {
    const router = useRouter()
    const { setLogs } = useContext(LogsContext)
    const { _users, refreshUsers, addUser } = useContext(SemaphoreContext)
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
        if (_users.length > 0) {
            setLogs(`${_users.length} user${_users.length > 1 ? "s" : ""} retrieved from the group 🤙🏽`)
        }
    }, [_users])

    const joinGroup = useCallback(async () => {
        if (!_identity) {
            return
        }

        setLoading.on()
        setLogs(`Joining the Feedback group...`)

        try {
            if (window.ethereum) {
                await window.ethereum.enable()
                const provider = new providers.Web3Provider(window.ethereum)
                const signer = provider.getSigner()
                const contract = new ethers.Contract(env.FEEDBACK_CONTRACT_ADDRESS, Feedback.abi, signer)
                const transaction = await contract.joinGroup(_identity.commitment.toString())
                await transaction.wait()
                addUser(_identity.commitment.toString())
                setLogs(`You joined the Feedback group event 🎉 Share your feedback anonymously!`)
            }
        } catch (err) {
            // revert 처리된 경우, 트랜잭션 실행에 실패하였습니다.
            setLogs("Status: Fail with error 'you are not member of group!!!'")
        }

        setLoading.off()
    }, [_identity])

    const userHasJoined = useCallback((identity: Identity) => _users.includes(identity.commitment.toString()), [_users])

    return (
        <>
            <Heading as="h2" size="xl">
                Groups
            </Heading>

            <Text pt="2" fontSize="md">
                Semaphore{" "}
                <Link href="https://semaphore.appliedzkp.org/docs/guides/groups" color="primary.500" isExternal>
                    groups
                </Link>{" "}
                are binary incremental Merkle trees in which each leaf contains an identity commitment for a user.
                Groups can be abstracted to represent events, polls, or organizations.
            </Text>
            <Box pb="5" pt="10">
                <Button
                    w="100%"
                    fontWeight="bold"
                    justifyContent="center"
                    colorScheme="primary"
                    px="4"
                    onClick={joinGroup}
                    isDisabled={_loading || !_identity || userHasJoined(_identity)}
                    // leftIcon={<IconAddCircleFill />}
                >
                    Join group
                </Button>
            </Box>
            <Divider pt="5" borderColor="gray.500" />
            <Stepper
                step={2}
                onPrevClick={() => router.push("/")}
                onNextClick={_identity && userHasJoined(_identity) ? () => router.push("/proofs") : undefined}
            />
        </>
    )
}
