import { Box, Button, Divider, Heading, HStack, Link, ListItem, OrderedList, Text, Input } from "@chakra-ui/react"
import { Identity } from "@semaphore-protocol/identity"
import { useRouter } from "next/router"
import { ChangeEvent, useCallback, useContext, useEffect, useState } from "react"
import Stepper from "../components/Stepper"
import LogsContext from "../context/LogsContext"
import IconAddCircleFill from "../icons/IconAddCircleFill"
import IconRefreshLine from "../icons/IconRefreshLine"
// import { providers } from "ethers"
import NameContext from "../context/NameContext"

export default function IdentitiesPage() {
    const router = useRouter()
    const { setLogs } = useContext(LogsContext)
    const [_identity, setIdentity] = useState<Identity>()
    const { setName } = useContext(NameContext)
    // const { _name } = useContext(NameContext)

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
        // _commitment
        //     :
        //     17309406718076004087796517097319487730078209309609031003444984472401410244026n
        // _nullifier
        //     :
        //     402052960700766359146757143149586941389673005083776943427944240592736307885n
        // _trapdoor
        //     :
        //     241098150834869025493403340272538519414447710532970408606671023771831910864n

        setIdentity(identity)

        localStorage.setItem("identity", identity.toString())
        // ["0x8874eb70a141fe0848400ea232048dc373afb6f0a8db44ceb2efab6b9a41d0","0xe38dcd25b7a96cd6bfc912b2383e35f866ffad4577baa6950be614bbb94aad"]

        setLogs("Your new Semaphore identity was just created 🎉")
    }, [])

    const [nameInput, setNameInput] = useState("")
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setNameInput(event.target.value)
    }

    useEffect(() => {
        setName(nameInput)
    }, [nameInput])

    return (
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
                    <Input mt={10} placeholder="Please enter your nickname" value={nameInput} onChange={handleChange} />
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
