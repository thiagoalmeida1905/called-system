import { useState, createContext, useEffect } from 'react';
import { auth, db } from '../services/firebaseConnection';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';


export const AuthContext = createContext({});


function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [ loadingAuth, setLoadingAuth] = useState(false); // estado para controlar o 'Spiner' indicação ao usuario que ha um processos sendo feito.

    function signIn(email, password) {
        console.log(email);
        console.log(password);
    }

    // Cadastrar um novo user
    async function signUp(email, password, name) {
        setLoadingAuth(true);

        await createUserWithEmailAndPassword(auth, email, password)
        .then ( async (value) => {
            let uid = value.user.uid

            await setDoc(doc(db, 'users', uid), { //doc -> acessa os docs / DB -> onde é o nosso banco // user -> nome da coleção // -> uid informações do usuario
                nome: name,
                avatarUrl: null
            })
            .then ( () => {
                let data = {
                    uid: uid,
                    nome: name,
                    email: value.user.email,
                    avatarUrl: null
                };

                setUser(data);
                setLoadingAuth(false);
            })
        })

        .catch( error => {
            console.log(error);
            setLoadingAuth(false);
        })
    }



    return (
        <AuthContext.Provider 
            value={{ 
                signed: !!user, //user está sendo transf p/ boolean
                user,
                signIn,
                signUp,
                loadingAuth
            }}
        >
            { children }
        </AuthContext.Provider>
    )
}

export default AuthProvider;