import { getApp } from "../config/firebase"
import { getDatabase, ref, set, update, push, child, onValue, get } from "firebase/database"

const REF = "files"

/**
 * Adds a new file data
 * to the Realtime-Database
 * 
 * TODO Test this first.
 * 
 * @param {*} file 
 * @returns 
 */
export const addFile = (file) => {
    const app = getApp()
    const database = getDatabase(app)

    const { fileName, path, } = file

    const newFile = {
        file_name: fileName,
        file_path: path,
        upload_date: new Date()
    }

    const newKey = push(child(ref(database), REF)).key

    const updates = {}
    updates[`/${REF}/` + newKey] = newFile
    
    return update(ref(database), updates)
}

/**
 * Automatically updates
 * the data based on the
 * uploaded files.
 * 
 * TODO Test this first.
 * 
 * @returns 
 */
export const readFiles = (callback) => {
    const app = getApp()
    const database = getDatabase(app)
    const filesRef = ref(database, `${REF}/`)

    return onValue(filesRef, (snapshot) => {
        callback(snapshot)
    })
}

export const readFilesOnce = (callback) => {
    const app = getApp()
    const database = getDatabase(app)
    const filesRef = ref(database, `${REF}/`)

    const dbRef = ref(getDatabase(app))
    return get(child(dbRef, `${REF}/`)).then(callback)
}

export const deleteFiles = () => {
    const app = getApp()
    const database = getDatabase(app)
    set(ref(database, `${REF}`), null)
}