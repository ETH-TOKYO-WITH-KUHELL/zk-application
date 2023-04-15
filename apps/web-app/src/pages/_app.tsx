import { Button, ChakraProvider, Container, HStack, Link, Spinner, Stack, Text } from "@chakra-ui/react"
import "@fontsource/inter/400.css"
import type { AppProps } from "next/app"
import getNextConfig from "next/config"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import LogsContext from "../context/LogsContext"
import SemaphoreContext from "../context/SemaphoreContext"
import useSemaphore from "../hooks/useSemaphore"
import theme from "../styles/index"
import NameContext from "../context/NameContext"

const { publicRuntimeConfig: env } = getNextConfig()

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter()
    const semaphore = useSemaphore()
    const [_logs, setLogs] = useState<string>("")
    const [_name, setName] = useState<string>("")

    function shortenAddress(address: string) {
        return `${address.slice(0, 6)}...${address.slice(-4)}`
    }

    function getExplorerLink(address: string) {
        if (address) {
            return `https://mumbai.polygonscan.com/address/${address}`
        }
        return ""
    }

    useEffect(() => {
        semaphore.refreshUsers()
        semaphore.refreshFeedback()
    }, [])

    return (
        <>
            <Head>
                <title>ETH TOKYO ZK TEAM</title>
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#ebedff" />
            </Head>

            <ChakraProvider theme={theme}>
                {/* check transactions */}
                <HStack align="center" justify="center" p="40" flexDirection={"column"}>
                    <Button onClick={() => router.push("/")}>
                        <Text>ETH TOKYO ZK TEAM</Text>
                    </Button>
                </HStack>
                <Stack>
                    <Container border={"1px solid #222"} p={10} borderRadius={10}>
                        This is a customized project that allows only address that has NFT issued by group (society,
                        company, etc.) and generate feedback afterwards. we added the login feature with the nickname
                        entered when someone joined the group. (Caution) Login must be failed if you enter a different
                        nickname. so you have to keep in mind the nickname that when the "joinGroup" transaction
                        occurred
                    </Container>
                </Stack>

                {/* Content */}
                <Container maxW="lg" flex="1" display="flex" alignItems="center">
                    <Stack py="8" display="flex" width="100%">
                        <SemaphoreContext.Provider value={semaphore}>
                            <LogsContext.Provider
                                value={{
                                    _logs,
                                    setLogs
                                }}
                            >
                                <NameContext.Provider value={{ _name, setName }}>
                                    <Component {...pageProps} />
                                </NameContext.Provider>
                            </LogsContext.Provider>
                        </SemaphoreContext.Provider>
                    </Stack>
                </Container>

                {/* 로딩 및 로그 표시 */}
                <HStack
                    flexBasis="56px"
                    borderTop="1px solid #8f9097"
                    backgroundColor="#DAE0FF"
                    align="center"
                    justify="center"
                    spacing="4"
                    p="4"
                >
                    {_logs.endsWith("...") && <Spinner color="primary.400" />}
                    <Text fontWeight="bold">{_logs || `Current step: ${router.route}`}</Text>
                </HStack>
            </ChakraProvider>
        </>
    )
}
