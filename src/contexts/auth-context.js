import React, { useState, useEffect } from 'react';

const AuthContext = React.createContext({
    userIsSignedIn: false,
    signInHandler: () => {},
    signOutHandler: () => {},
});

export const AuthContextProvider = (props) => {

    const [userIsSignedIn, setUserIsSignedIn] = useState(false);

    const signInHandler = () => {
        localStorage['userIsSignedIn'] = '1';
        setUserIsSignedIn(true);
    }
    
    const signOutHandler = () => {
        localStorage.removeItem('userIsSignedIn');
        setUserIsSignedIn(false);
    }

    useEffect(()=>{
        if(localStorage.getItem('userIsSignedIn') === '1')
            signInHandler();
    },[]);

    return (
        <AuthContext.Provider
            value={{
                userIsSignedIn,
                signInHandler,
                signOutHandler,
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;