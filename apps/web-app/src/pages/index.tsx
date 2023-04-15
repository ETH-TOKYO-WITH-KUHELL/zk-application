import { Box, Button, Divider, HStack, Text, Input } from "@chakra-ui/react"
import { Identity } from "@semaphore-protocol/identity"
import { useRouter } from "next/router"
import { useCallback, useContext, useEffect, useState } from "react"
import Stepper from "../components/Stepper"
import LogsContext from "../context/LogsContext"
import IconAddCircleFill from "../icons/IconAddCircleFill"
import IconRefreshLine from "../icons/IconRefreshLine"
import NameContext from "../context/NameContext"
import { ethers, providers } from "ethers"
import { formatBytes32String } from "ethers/lib/utils"
import Feedback from "../../contract-artifacts/Feedback.json"
import getNextConfig from "next/config"

const { publicRuntimeConfig: env } = getNextConfig()

declare global {
    interface Window {
        ethereum?: any
    }
}

export default function IdentitiesPage() {
    const router = useRouter()
    const { setLogs } = useContext(LogsContext)
    const [_identity, setIdentity] = useState<Identity>()
    const { setName } = useContext(NameContext)
    const [nameInput, setNameInput] = useState("")
    const [pageStep, setPageStep] = useState(false)
    const [loginLoading, stLoginLoading] = useState(false)
    const { _name } = useContext(NameContext)

    /** Input setName Fn */
    const handleChange = (event) => setNameInput(event.target.value)

    /** Login Fn */
    const LoginBtn = async () => {
        stLoginLoading(true)
        try {
            if (window.ethereum) {
                await window.ethereum.enable()
                const provider = new providers.Web3Provider(window.ethereum)
                const signer = provider.getSigner()
                const contract = new ethers.Contract(env.FEEDBACK_CONTRACT_ADDRESS, Feedback.abi, signer)
                console.log("1")
                const transaction = await contract.getUserInfo(formatBytes32String(_name))
                console.log("2", transaction.toString())
                // const res = await transaction.wait()
                console.log("3")
                // console.log("transaction: ", res)
                console.log("로그인 성공!")
                setLogs(`You joined the Feedback group event 🎉 Share your feedback anonymously!`)
            }
        } catch (err) {
            // revert 처리된 경우, 트랜잭션 실행에 실패하였습니다.
            console.log("로그인 실패!")
            setLogs("Status: Fail with error 'you are not member of group!!!'")
        }

        // 성공하면 로딩 제거 후 다음 스텝
        // stLoginLoading(false)
        // setPageStep(true)
    }

    useEffect(() => {
        const identityString = localStorage.getItem("identity")
        if (identityString) {
            const identity = new Identity(identityString)
            setIdentity(identity)
            setLogs("Your Semaphore identity was retrieved from the browser cache 👌🏽")
        } else {
            setLogs("Create your Semaphore identity 👆🏽")
        }
    }, [])

    const createIdentity = useCallback(async () => {
        const identity = new Identity()
        setIdentity(identity)
        localStorage.setItem("identity", identity.toString())
        setLogs("Your new Semaphore identity was just created 🎉")
    }, [])

    useEffect(() => {
        setName(nameInput)
    }, [nameInput])

    return !pageStep ? (
        <>
            <Input mb={10} placeholder="Please enter your nickname" value={nameInput} onChange={handleChange} />
            <Button isLoading={loginLoading} variant="outline" onClick={() => LoginBtn()}>
                login
            </Button>
        </>
    ) : (
        <>
            <HStack pt="5" justify="space-between">
                <Text fontWeight="bold" fontSize="lg">
                    Identity
                </Text>
                {_identity && (
                    <Button leftIcon={<IconRefreshLine />} variant="link" color="text.700" onClick={createIdentity}>
                        New
                    </Button>
                )}
            </HStack>

            {_identity ? (
                <Box py="6" whiteSpace="nowrap">
                    <Box p="5" borderWidth={1} borderColor="gray.500" borderRadius="4px">
                        <Text textOverflow="ellipsis" overflow="hidden">
                            Trapdoor: {_identity.trapdoor.toString()}
                        </Text>
                        <Text textOverflow="ellipsis" overflow="hidden">
                            Nullifier: {_identity.nullifier.toString()}
                        </Text>
                        <Text textOverflow="ellipsis" overflow="hidden">
                            Commitment: {_identity.commitment.toString()}
                        </Text>
                    </Box>
                </Box>
            ) : (
                <Box py="6">
                    <Button
                        w="100%"
                        fontWeight="bold"
                        justifyContent="left"
                        colorScheme="primary"
                        px="4"
                        onClick={createIdentity}
                        leftIcon={<IconAddCircleFill />}
                    >
                        Create identity
                    </Button>
                </Box>
            )}

            <Divider pt="3" borderColor="gray" />

            <Stepper step={1} onNextClick={_identity && (() => router.push("/groups"))} />
        </>
    )
}
