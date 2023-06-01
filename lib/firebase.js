import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, where, getDocs, getDoc, doc, query, limit, setDoc, orderBy, startAt, Timestamp } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { stringToSlug } from "./helpers";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBpyEt9PTcdtax6J9Mkq9aL5UmHKx7cvwM",
  authDomain: "data-science-project-9a237.firebaseapp.com",
  projectId: "data-science-project-9a237",
  storageBucket: "data-science-project-9a237.appspot.com",
  messagingSenderId: "576685900181",
  appId: "1:576685900181:web:c312c356a2f4ed62fd369c",
  measurementId: "G-88BV7B0RD9"
};

// Initialize Firebase
function createFirebaseApp(config) {
    try {
    return getApp();
    } catch {
    return initializeApp(config);
    }
}
  
const firebaseApp = createFirebaseApp(firebaseConfig);

// Auth exports
export const auth = getAuth(firebaseApp);
export const googleAuthProvider = new GoogleAuthProvider();

// Firestore exports
export const firestore = getFirestore(firebaseApp);

// Storage exports
export const storage = getStorage(firebaseApp);
export const STATE_CHANGED = 'state_changed';


// -------------------------- FUNCTIONS

export const getAllArticles = async () => {
    const querySnapshot = await getDocs(collection(firestore, "articles"));
      
    const articles = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return { 
        id: doc.id, 
        ...data,
        datetime: data.datetime.toDate(),
      }
    });
  
    return articles;
}

export const getArticle = async (id) => {

    const articleDoc = doc(firestore, "articles", id);
    const articleSnapshot = await getDoc(articleDoc);
  
    if (articleSnapshot.exists()) {
      return {
        id: articleSnapshot.id,
        ...articleSnapshot.data()
      }
    } else {
      console.log(`No tool found with id: ${id}`);
      return null;
    }
}

export const uploadArticle = async (title, content) => {
    const docData = {
        title: title,
        content: content,
        datetime: Timestamp.fromDate(new Date()),
    };

    await setDoc(doc(firestore, "articles", stringToSlug(title)), docData);
}