import { ChakraProvider, Container, HStack, Icon, IconButton, Link, Spinner, Stack, Text } from "@chakra-ui/react"
import "@fontsource/inter/400.css"
import { Network } from "@semaphore-protocol/data"
import type { AppProps } from "next/app"
import getNextConfig from "next/config"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { FaGithub } from "react-icons/fa"
import LogsContext from "../context/LogsContext"
import SemaphoreContext from "../context/SemaphoreContext"
import useSemaphore from "../hooks/useSemaphore"
import theme from "../styles/index"
import styled from "styled-components"

const { publicRuntimeConfig: env } = getNextConfig()

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter()
    const semaphore = useSemaphore()
    const [_logs, setLogs] = useState<string>("")

    useEffect(() => {
        semaphore.refreshUsers()
        semaphore.refreshFeedback()
    }, [])

    function shortenAddress(address: string) {
        return `${address.slice(0, 6)}...${address.slice(-4)}`
    }

    function getExplorerLink(address: string) {
        if (address) {
            return `https://mumbai.polygonscan.com/address/${address}`
        }
        return ""
    }

    return (
        <>
            <Head>
                <title>ETH TOKYO KuHell-Hunsman</title>
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#ebedff" />
            </Head>
            <Main>
                <Right>
                    <Container maxW="lg" flex="1" display="flex" alignItems="center">
                        <Stack py="8" display="flex" width="100%">
                            <SemaphoreContext.Provider value={semaphore}>
                                <LogsContext.Provider
                                    value={{
                                        _logs,
                                        setLogs
                                    }}
                                >
                                    <Component {...pageProps} />
                                </LogsContext.Provider>
                            </SemaphoreContext.Provider>
                        </Stack>
                    </Container>

                    {/* <HStack
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
                    </HStack> */}
                </Right>
            </Main>
        </>
    )
}
const Main = styled.div`
    padding: 0 200px;
    width: 1440px;
    height: 100vh;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    box-sizing: border-box;
`

const Right = styled.div`
    display: inline-block;
    width: 100%;
    height: 100vh;
`
