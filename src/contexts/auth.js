import { useState, createContext, useEffect} from 'react';
import { auth, db } from '../services/firebaseConnection';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


export const AuthContext = createContext({});


function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [ loadingAuth, setLoadingAuth] = useState(false); // estado para controlar o 'Spiner' indicação ao usuario que ha um processos sendo feito.
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        async function loadUser(){
            const storageUser = localStorage.getItem('@ticketsPRO')

            if (storageUser) {
                setUser(JSON.parse(storageUser));
                setLoading(false);
            }

            setLoading(false);
        }

        loadUser();
    }, [])

    async function signIn(email, password) {
        setLoadingAuth(true);

        await signInWithEmailAndPassword(auth, email, password)
        .then(async (value) => {
            let uid = value.user.uid;

            const docRef = doc(db, 'users', uid);// referência de onde estão os dados
            const docSnap = await getDoc(docRef);

            let data = {
                uid: uid,
                nome: docSnap.data().nome,
                email: value.user.email,
                avatarUrl: docSnap.data().avatarUrl
            }

            setUser(data);
            storageUser(data);
            setLoadingAuth(false);
            toast.success('Bem-vindo(a) de volta!')
            navigate('/dashboard')
        })
        .catch((error)=> {
            console.log(error);
            setLoadingAuth(false);
            toast.error('Ops algo deu errado!');
        })
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

    async function logout (){
        await signOut(auth);
        localStorage.removeItem('@ticketsPRO');
        setUser(null);
    }


    return (
        <AuthContext.Provider 
            value={{ 
                signed: !!user, //user está sendo transf p/ boolean
                user,
                signIn,
                signUp,
                logout,
                loadingAuth,
                loading,
                storageUser,
                setUser
            }}
        >
            { children }
        </AuthContext.Provider>
    )
}

export default AuthProvider;