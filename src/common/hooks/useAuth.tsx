import { useContext } from "react"
import { authContext } from "../contexts/AuthContext"
import { ProviderProps } from "../interface/Auth/auth"

export const useAuth = (): ProviderProps => {
    return useContext(authContext)
}