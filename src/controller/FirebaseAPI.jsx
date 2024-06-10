import { getApp } from "../config/firebase";
import { getDatabase, ref, set, update, push, onValue, get, child, remove } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

const REF = "files";

export const addFile = async (file) => {
    const app = getApp();
    const storage = getStorage(app);
    const database = getDatabase(app);

    const { fileName, fileContent } = file;
    const storageReference = storageRef(storage, `files/${fileName}`);
    
    // Upload file to Firebase Storage
    await uploadBytes(storageReference, fileContent);

    // Get the download URL
    const url = await getDownloadURL(storageReference);
    console.log('Download URL:', url);

    const newFile = {
        fileName,
        url,
        uploadDate: new Date().toISOString()
    };

    const newKey = push(child(ref(database), REF)).key;

    const updates = {};
    updates[`/${REF}/` + newKey] = newFile;

    return update(ref(database), updates);
};

export const readFiles = (callback) => {
    const app = getApp();
    const database = getDatabase(app);
    const filesRef = ref(database, `${REF}/`);

    return onValue(filesRef, (snapshot) => {
        callback(snapshot);
    });
};

export const readFilesOnce = (callback) => {
    const app = getApp();
    const database = getDatabase(app);
    const dbRef = ref(database);

    return get(child(dbRef, `${REF}/`)).then(callback);
};

export const deleteFiles = async () => {
    const app = getApp();
    const database = getDatabase(app);
    await set(ref(database, `${REF}`), null);
    await set(ref(database, 'printDetails/'), null);
};

export const readFileFromFirebase = async (filePath) => {
    const app = getApp();
    const database = getDatabase(app);
    const fileRef = ref(database, `${REF}/${filePath}`);

    try {
        const snapshot = await get(fileRef);
        if (snapshot.exists()) {
            const fileData = snapshot.val();
            console.log("File data received from Firebase:", fileData);
            return fileData.url; // Return the file URL from Firebase Storage
        } else {
            throw new Error("File not found");
        }
    } catch (error) {
        console.error("Error reading file from Firebase:", error);
        throw error;
    }
};
