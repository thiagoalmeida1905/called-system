import { useState, createContext, useEffect } from 'react';


export const AuthContext = createContext({});


function AuthProvider({ children }) {

    const [user, setuser] = useState(null);

    function signIn(email, password) {
        console.log(email);
        console.log(password);
    }

    return (
        <AuthContext.Provider 
            value={{ 
                signed: !!user, //user está sendo transf p/ boolean
                user,
                signIn
            }}
        >
            { children }
        </AuthContext.Provider>
    )
}

export default AuthProvider;