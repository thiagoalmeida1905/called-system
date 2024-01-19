import { useState, createContext, useEffect } from 'react';
import { auth, db } from '../services/firebaseConnection';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


export const AuthContext = createContext({});


function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [ loadingAuth, setLoadingAuth] = useState(false); // estado para controlar o 'Spiner' indicação ao usuario que ha um processos sendo feito.

    const navigate = useNavigate();

    function signIn(email, password) {
        console.log(email);
        console.log(password);
    }

    // Cadastrar um novo user
    async function signUp(email, password, name) {
        setLoadingAuth(true);// indicação de operação de autenticação sendo feita

        await createUserWithEmailAndPassword(auth, email, password)
        .then ( async (value) => {
            let uid = value.user.uid;

            await setDoc(doc(db, 'users', uid), { //doc -> acessa os docs / DB -> onde é o nosso banco // user -> nome da coleção // -> uid informações do usuario
                nome: name,
                avatarUrl: null
            })
            .then ( () => { 
                let data = { // objeto com os dados do usuario
                    uid: uid,
                    nome: name,
                    email: value.user.email,
                    avatarUrl: null
                };

                setUser(data);
                storageUser(data);
                setLoadingAuth(false);// aqui indica que toda a operação foi bem sucedida
                toast.success('Seja bem-vindo ao sistema')
                navigate('/dashboard');
            })
        })

        .catch( error => {
            console.log(error);
            setLoadingAuth(false);
        })
    }

    function storageUser (data) { // função para salvar os dados do Usuario no local storage
        localStorage.setItem('@ticketsPRO', JSON.stringify(data))
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