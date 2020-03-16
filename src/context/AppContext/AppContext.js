import React, { createContext, useState, useEffect } from "react"
import getUserInfo from "../../db/getUserInfo";
import Constants from 'expo-constants';


const initialState = {
    isLoggedIn: false,
    user: null,
};

const AppContext = createContext(initialState);



const AppContextProvider = ({ children }) => {
    const [state, setState] = useState(initialState);
    
    useEffect(() => {
        getUserInfo({ userID: Constants.installationId }).then((user) => {
            setState({
                ...state,
                isLoggedIn: true,
                userID: Constants.installationId,
                user
            })
        }
        )
    }, []);

    return <AppContext.Provider value={state}>{children}</AppContext.Provider>
};

export {
    AppContext,
    AppContextProvider
}