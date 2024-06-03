import { getApp } from "../config/firebase";
import { getDatabase, ref, set, update, push, onValue, get, child } from "firebase/database";

const REF = "files";

/**
 * Adds a new file to the Realtime Database.
 * @param {Object} file - The file to be added.
 * @param {string} file.fileName - The name of the file.
 * @param {string} file.path - The path of the file.
 * @returns {Promise<void>}
 */
export const addFile = (file) => {
    const app = getApp();
    const database = getDatabase(app);

    const { fileName, path } = file;

    const newFile = {
        fileName: fileName,
        path: path,
        uploadDate: new Date().toISOString()
    };

    const newKey = push(child(ref(database), REF)).key;

    const updates = {};
    updates[`/${REF}/` + newKey] = newFile;

    return update(ref(database), updates);
};

/**
 * Reads the files from the Realtime Database and calls the provided callback with the data.
 * @param {Function} callback - The callback function to be called with the data.
 */
export const readFiles = (callback) => {
    const app = getApp();
    const database = getDatabase(app);
    const filesRef = ref(database, `${REF}/`);

    return onValue(filesRef, (snapshot) => {
        callback(snapshot);
    });
};

/**
 * Reads the files from the Realtime Database once and calls the provided callback with the data.
 * @param {Function} callback - The callback function to be called with the data.
 * @returns {Promise<void>}
 */
export const readFilesOnce = (callback) => {
    const app = getApp();
    const database = getDatabase(app);
    const dbRef = ref(database);

    return get(child(dbRef, `${REF}/`)).then(callback);
};

/**
 * Deletes all files from the Realtime Database.
 * @returns {Promise<void>}
 */
export const deleteFiles = () => {
    const app = getApp();
    const database = getDatabase(app);
    return set(ref(database, `${REF}`), null);
};
