import { Box, Button, Divider, HStack, Text, background } from "@chakra-ui/react"
import { Identity } from "@semaphore-protocol/identity"
import { useRouter } from "next/router"
import { useCallback, useContext, useEffect, useState } from "react"
import Stepper from "../components/Stepper"
import LogsContext from "../context/LogsContext"
import IconAddCircleFill from "../icons/IconAddCircleFill"
import IconRefreshLine from "../icons/IconRefreshLine"
import styled from "styled-components"

export default function IdentitiesPage() {
    const router = useRouter()
    const { setLogs } = useContext(LogsContext)
    const [_identity, setIdentity] = useState<Identity>()
    const [userName, setUserName] = useState<string>("")

    useEffect(() => {
        setUserName("")
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

    /** 이룸 입력 */
    const chageInput = (event) => {
        setUserName(event.target.value)
    }

    return (
        <>
            <MainDiv>
                <NameInput
                    type="text"
                    value={userName}
                    onChange={chageInput}
                    placeholder="Please enter an anonymous nickname"
                />
            </MainDiv>
            {/* <HStack pt="5" justify="space-between">
                <Text fontWeight="bold" fontSize="lg">
                    Identity
                </Text>
                {_identity && (
                    <Button leftIcon={<IconRefreshLine />} variant="link" color="text.700" onClick={createIdentity}>
                        New
                    </Button>
                )}
            </HStack> */}

            {/* <div style={{ backgroundColor: "#222" }}>
                <input />
                <button />
            </div> */}
            {/* {_identity ? (
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
            )} */}

            <Divider pt="3" borderColor="gray" />

            <Stepper step={1} onNextClick={_identity && (() => router.push("/groups"))} />
        </>
    )
}

const MainDiv = styled.div`
    width: 100%;
    justify-content: flex-end;
    height: auto;
`

const NameInput = styled.input`
    padding: 15px;
    width: 100%;
    height: auto;
    font-size: 24px;
    border: 1px solid #222;
    border-radius: 10px;
    box-sizing: border-box;
`
