import { app, database } from "../config/firebase";
import { ref, update, push, child, onValue, get, set } from "firebase/database";

const REF = "files";

export const addFile = async (file) => {
    try {
        const { fileName, path, upload_date } = file;

        const newFile = {
            file_name: fileName,
            file_path: path,
            upload_date: upload_date
        };

        const newKey = push(child(ref(database), REF)).key;
        const updates = {};
        updates[`/${REF}/` + newKey] = newFile;

        await update(ref(database), updates);
        console.log("File added to Firebase");
    } catch (error) {
        console.error("Error adding file to Firebase:", error);
        throw error;
    }
};

export const readFiles = (callback) => {
    const filesRef = ref(database, `${REF}/`);
    return onValue(filesRef, (snapshot) => {
        callback(snapshot);
    });
};

export const readFilesOnce = (callback) => {
    const filesRef = ref(database, `${REF}/`);
    const dbRef = ref(database);
    return get(child(dbRef, `${REF}/`)).then(callback);
};

export const deleteFiles = () => {
    set(ref(database, `${REF}`), null);
};
