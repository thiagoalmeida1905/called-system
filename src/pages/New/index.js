import { useState, useEffect, useContext } from 'react';
import Header from '../../components/Header';
import Title from '../../components/Title';
import './new.css';
import { FiPlusCircle } from 'react-icons/fi';
import { AuthContext } from '../../contexts/auth';
import { db } from '../../services/firebaseConnection';
import { collection, getDocs, getDoc, doc, addDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';


const listRef = collection(db, 'customers');//REFERÊNCIA À COLEÇÃO DE CLIENTE

export default function New() {
    const { user } = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();

    const [ customers, setCustomer ] = useState([]);
    const [ loadCustomer, setLoadCustomer ] = useState(true);
    const [ customerSelected, setCustomerSelected ] = useState(0)
    const [ complemento, setComplemento ] = useState('');
    const [ assunto, setAssunto ] = useState('Suporte');
    const [ status, setStatus ] = useState('Aberto');
    const [ idCustomer, setIdCustomer ] = useState(false)

    useEffect( ()=>{ //BUSCANDO INFORMAÇÃO DE TODOS OS CLIENTES CADASTRADOS NA MONTAGEM DO COMPONENTE
        async function loadCustomer(){
            const querySnapshot = await getDocs(listRef) //retorna o que tem na coleção de clientes
            .then ( (snapshot) => { //snapshot vai conter os dados da coleção de clientes
                let lista = [];

                snapshot.forEach(( doc ) => { //Percorrer os dados trazidos pela promise(snapshot)
                    lista.push({ // colocar os dados na lista vazia
                        id: doc.id,
                        nomeFantasia: doc.data().nomeFantasia
                    })
                })

                if (snapshot.docs.size === 0){ //se não tiver nenhum cliente
                    setCustomer([{id: '1', nomeFantasia: 'FREELA'}])
                    setLoadCustomer(false)
                    return;
                }

                setCustomer(lista);
                setLoadCustomer(false);

                if(id){
                    loadId(lista);
                }

            })
            .catch((error) => {
                console.log('ERRO AO BUSCAR OS CLIENTES', error)
                setLoadCustomer(false)
                setCustomer([{id: '1', nomeFantasia: 'FREELA'}])

            })
        }

        loadCustomer()
    }, [id])

    async function loadId(lista){
        const docRef = doc(db, 'chamados', id)
        await getDoc(docRef)
        .then((snapshot)=>{
            setAssunto(snapshot.data().assunto);
            setStatus(snapshot.data().status);
            setComplemento(snapshot.data().complemento);

            let index = lista.findIndex(item => item.id === snapshot.data().clienteId);
            setCustomerSelected(index);
            setIdCustomer(true);
        })
        .catch((error)=>{
            console.log(error)
            setIdCustomer(false);
        })
    }

    function handleOptionChange(e) {
        setStatus(e.target.value)
    }

    function handleChangeSelect(e) {
        setAssunto(e.target.value)
    }

    function handleChangeCustomer(e) {
        setCustomerSelected(e.target.value)
    }


    //----------------- Função para cadastar chamado ------------------------------------ //

    async function handleRegister (e) {
        e.preventDefault();

        // Atualizando chamado
        if(idCustomer){
            const docRef = doc(db, 'chamados', id)
            await updateDoc(docRef, {
                cliente: customers[customerSelected].nomeFantasia,
                clienteId: customers[customerSelected].id,
                assunto: assunto,
                complemento: complemento,
                status: status,
                userId: user.uid
            }).then (()=> {
                toast.info('Chamado atualizado com sucesso!')
                setCustomerSelected(0);
                setComplemento('');
                navigate('/dashboard')
            })
            .catch((error) => {
                toast.error('ops erro ao atualizar esse chamado!')
                console.log(error)
            })
            return;
        }

        //registrando um chamado
        await addDoc(collection(db, 'chamados'), {
            created: new Date(),
            cliente: customers[customerSelected].nomeFantasia,
            clienteId: customers[customerSelected].id,
            assunto: assunto,
            complemento: complemento,
            status: status,
            userId: user.uid
        })
        .then ( () => {
            toast.success('Chamado registrado');
            setComplemento('')
            setCustomerSelected(0)
        })
        .catch( (error) => {
            toast.error('Ops! erro ao registrar, tente novamente mais tarde!')
        })
    }


    return (
        <div>
            <Header/>

            <div className="content">
                <Title name={id ? 'Editando chamado' : 'Novo chamado'}>
                    <FiPlusCircle size={25}/>
                </Title>

                <div className="container">
                    <form className='form-profile' onSubmit={handleRegister}>

                        <label>Clientes</label>
                        {
                            loadCustomer ? (
                                <input type='text' disabled={true} value={'Carregando...'}/>
                            ) : (
                                <select value={customerSelected} onChange={handleChangeCustomer}>
                                    { customers.map( (item, index) => {
                                        return (
                                            <option key={index} value={index}>
                                                {item.nomeFantasia}
                                            </option>
                                        )
                                    }) }
                                </select>
                            )
                        }

                        <label>Assunto</label>
                        <select value={assunto} onChange={handleChangeSelect}>
                            <option value="Suporte">Suporte</option>
                            <option value="Visita Tecnica">Visita Tecnica</option>
                            <option value="Financeiro">Financeiro</option>
                        </select>

                        <label>Status</label>
                        <div className="status">
                            <input 
                                type="radio"
                                name='radio'
                                value='Aberto' 
                                onChange={handleOptionChange}
                                checked={ status === 'Aberto'}
                            />
                            <span>Em aberto</span>

                            <input 
                                type="radio"
                                name='radio'
                                value='Progresso' 
                                onChange={handleOptionChange}
                                checked={ status === 'Progresso'}
                            />
                            <span>Progresso</span>

                            <input 
                                type="radio"
                                name='radio'
                                value='Atendido'
                                onChange={handleOptionChange}
                                checked={ status === 'Atendido'}
                            />
                            <span>Atendido</span>
                        </div>

                        <label>Complemento</label>
                        <textarea
                            type='text'
                            value={complemento}
                            onChange={ e => setComplemento(e.target.value)}
                            placeholder='Descreva seu problema (opcional).'
                        />

                        <button type='submit'>Registrar</button>
                    </form>
                </div>
            </div>
        </div>
    )
}