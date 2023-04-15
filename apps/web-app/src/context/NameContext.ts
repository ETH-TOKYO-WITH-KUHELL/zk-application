import React from "react"

export type NameContextType = {
    _name: string
    setName: (name: string) => void
}

export default React.createContext<NameContextType>({
    _name: "",
    setName: (name: string) => name
})
