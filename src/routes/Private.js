import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth";


export default function Private ({ children }){
    const { signed, loading } = useContext(AuthContext);

    if(loading) { //verifica se estiver carregando
        return (
            <div>

            </div>
        )
    }

    if (!signed) {// verifica se está logado, se sim 'children' é renderizado
        return <Navigate to='/'/>
    } 

    return children;
}