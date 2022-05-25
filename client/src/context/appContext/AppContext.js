import { createContext, useReducer } from "react"
import AppReducer from "./AppReducer";

const INITIAL_STATE = {
    authenticated: false,
    user: null,
    error: false
}

export const AppContext = createContext(INITIAL_STATE);

export const AppContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(AppReducer, INITIAL_STATE);
    return (
        <AppContext.Provider
            value={{
                authenticated: state.authenticated,
                user: state.user,
                error: state.error,
                dispatch,
            }}>
                {children}
        </AppContext.Provider>
    )
}