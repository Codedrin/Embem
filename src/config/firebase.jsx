import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FB_API_KEY,
    authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FB_DB_URL,
    projectId: import.meta.env.VITE_FB_PROJ_ID,
    storageBucket: import.meta.env.VITE_FB_STRG_BCKT,
    messagingSenderId: import.meta.env.VITE_FB_MSG_SNDR_ID,
    appId: import.meta.env.VITE_FB_APP_ID,
    measurementId: import.meta.env.VITE_FB_MSRMNT_ID
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { app, database };
