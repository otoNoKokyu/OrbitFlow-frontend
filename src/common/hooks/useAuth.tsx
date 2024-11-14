import { useContext } from "react"
import { authContext } from "../contexts/AuthContext"
import { ProviderProps } from "../types/Auth/auth"

export const useAuth = (): ProviderProps => {
    return useContext(authContext)
}