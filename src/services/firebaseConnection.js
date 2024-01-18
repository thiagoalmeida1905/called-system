
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage} from 'firebase/storage';


const firebaseConfig = { //Credenciais
    apiKey: "AIzaSyC_JpqZ7NYLhIkFt160sRotUOHaheIXDEg",
    authDomain: "called-system.firebaseapp.com",
    projectId: "called-system",
    storageBucket: "called-system.appspot.com",
    messagingSenderId: "448827061728",
    appId: "1:448827061728:web:944dc13f5826bb6cd3e785",
    measurementId: "G-KCSJJ4V1PC"
  };

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { auth, db, storage};
