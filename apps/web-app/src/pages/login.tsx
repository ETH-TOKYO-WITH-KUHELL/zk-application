import { Box, Button, Divider, HStack, Text, Input } from "@chakra-ui/react"
import { Identity } from "@semaphore-protocol/identity"
import { useRouter } from "next/router"
import { useCallback, useContext, useEffect, useState } from "react"
import Stepper from "../components/Stepper"
import LogsContext from "../context/LogsContext"
import IconAddCircleFill from "../icons/IconAddCircleFill"
import IconRefreshLine from "../icons/IconRefreshLine"
import NameContext from "../context/NameContext"

export default function LoginPage() {
    const router = useRouter()
    const [_identity, setIdentity] = useState<Identity>()

    return (
        <>
            <Text>로그인 페이지 테스트</Text>
            <Divider pt="3" borderColor="gray" />

            <Stepper step={1} onNextClick={_identity && (() => router.push("/groups"))} />
        </>
    )
}
