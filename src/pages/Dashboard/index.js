import { useContext } from "react";
import { AuthContext } from "../../contexts/auth";
import Header from "../../components/Header";
import Title from "../../components/Title";
import './dashboard.css';
import { FiPlus, FiMessageSquare, FiSearch, FiEdit2 } from "react-icons/fi";
import { Link } from "react-router-dom";



export default function Dashboard () {

    const { logout } = useContext(AuthContext);

    async function handleLogout () {
        await logout();
    }

    return (
        <div>
            <Header/>
            <div className="content">
                <Title name='Tickets'>
                    <FiMessageSquare size={25}/>
                </Title>

                <>
                    <Link to='/new' className="new">
                        <FiPlus color="#fff" size={25}/>
                        Novo chamado
                    </Link>

                    <table>
                        <thead>
                            <tr>
                                <th scope="col">Cliente</th>
                                <th scope="col">Assunto</th>
                                <th scope="col">
                                    <span className="badge" style={ { backgroundColor: '#999' }}>
                                        Em aberto
                                    </span>
                                </th>
                                <th scope="col">Cadastrado em</th>
                                <th scope="col">#</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td data-label='Cliente'> Mercado Esquina</td>
                                <td data-label='Assunto'> Suporte</td>
                                <td data-label='Status'> Em aberto</td>
                                <td data-label='Status'> 12/05/2024</td>
                                <td data-label='#'>
                                    <button className="action" style={{ backgroundColor: '#3583f6'}}>
                                        <FiSearch color='#fff' size={17}/>
                                    </button>
                                    <button className="action" style={{ backgroundColor: '#f6a935'}}>
                                        <FiEdit2 color='#fff' size={17}/>
                                    </button>
                                </td>
                            </tr>

                            <tr>
                                <td data-label='Cliente'> Informatica</td>
                                <td data-label='Assunto'> Suporte</td>
                                <td data-label='Status'> Em aberto</td>
                                <td data-label='Status'> 12/05/2024</td>
                                <td data-label='#'>
                                    <button className="action" style={{ backgroundColor: '#3583f6'}}>
                                        <FiSearch color='#fff' size={17}/>
                                    </button>
                                    <button className="action" style={{ backgroundColor: '#f6a935'}}>
                                        <FiEdit2 color='#fff' size={17}/>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </>


            </div>
            <button onClick={handleLogout}>Sair da conta </button>
        </div>
    )
}