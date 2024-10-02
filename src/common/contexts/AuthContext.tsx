import { ReactNode } from 'react'
import { createContext, useState } from 'react'
import { ProviderProps, LoginType } from '../interface/Auth/auth'

export const authContext = createContext<ProviderProps>({
    login: ()=>{},
    logout: ()=> {},
    user: '',
    token: ''

})
const AuthProvider = ({children}:{children: ReactNode}) => {
    const existsUser = localStorage.getItem('me')? JSON.parse(localStorage.getItem('me') || '{}'): ''
    const [user,setUser] = useState(existsUser)

    const login = (data: LoginType) => {
        const obj = {
            ...data,
             token: Math.random(),
        }
        setUser(obj)
        localStorage.setItem('me',JSON.stringify({...obj}))
    }
    const logout = () => {
        localStorage.removeItem('me')
        setUser({})
    }

    
  return (
    <authContext.Provider value={{login, logout, user, token: user.token || '' }}>
        {children}
    </authContext.Provider>
  )
}

export default AuthProvider
