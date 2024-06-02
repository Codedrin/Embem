const LS_DB_ACC_TKN = "dropbox_access_token"
const LS_DB_EXPI    = "dropbox_expiration_datetime"

const DROPBOX_CLIENT_KEY           = import.meta.env.VITE_DB_CLIENT_KEY
const DROPBOX_CLIENT_SECERT        = import.meta.env.VITE_DB_CLIENT_SECRET
const DROPBOX_CLIENT_REFRESH_TOKEN = import.meta.env.VITE_DB_REFRESH_TOKEN

const PATH = "/embem/session/files/"

const UPLOAD_ENDPOINT = "https://content.dropboxapi.com/2/files/upload"
const DOWNLOAD_ENDPOINT = "https://content.dropboxapi.com/2/files/download"
const DELETE_BATCH_FILES_ENDPOINT = "https://api.dropboxapi.com/2/files/delete_batch"
const REFRESH_TOKEN_ENDPOINT = "https://api.dropbox.com/oauth2/token"

export const uploadFile = async (file) => {
    const { name } = file

    try{
        let DROPBOX_API_KEY = await checkToken()

        const formData = new FormData()
        formData.append("file", file)

        const headers = {
            "Authorization"   : `Bearer ${DROPBOX_API_KEY}`,
            "Content-Type"    : "application/octet-stream",
            "Dropbox-API-Arg" : JSON.stringify({
                autorename: false,
                mode: "add",
                mute: false,
                path: `${PATH}${name}`,
                strict_conflict: false
            })
        }

        const response = await fetch(UPLOAD_ENDPOINT, {
            method: "POST",
            headers,
            body: formData
        })

        if(response.ok) {
            const jsonData = await response.json()
            return {
                data: jsonData,
                status: response.status
            }
        }else{
            throw new Error(`An error occured with ${response.status} status code.`)
        }
    }catch(error) {
        console.error(error)
        return {
            error,
            status: error
        }
    }
}

export const downloadFile = async (path) => {
    try{
        let DROPBOX_API_KEY = await checkToken()

        const headers = {
            "Authorization"   : `Bearer ${DROPBOX_API_KEY}`,
            "Dropbox-API-Arg" : JSON.stringify({
                path: path
            })
        }

        const response = await fetch(DOWNLOAD_ENDPOINT, {
            method: "POST",
            headers
        })

        const blob = await response.blob()
        return blob
    }catch(error){
        console.log(error)
        return null
    }
}

export const deleteFiles = async (entries) => {
    try{
        let DROPBOX_API_KEY = await checkToken()

        const headers = {
            "Authorization" : `Bearer ${DROPBOX_API_KEY}`,
            "Content-Type"  : "application/json",
        }

        const response = await fetch(DELETE_BATCH_FILES_ENDPOINT, {
            method: "POST",
            headers,
            body: JSON.stringify({
                entries: [...entries]
            })
        })

        const data = await response.json()
        console.log(data)
    }catch(error){
        console.error(error)
        return false
    }

    return true
}

export const requestNewToken = async () => {
    try{
        let basicAuth = `Basic ${btoa(`${DROPBOX_CLIENT_KEY}:${DROPBOX_CLIENT_SECERT}`)}`
        
        const headers = {
            Authorization  : basicAuth,
            "Content-Type" : "application/x-www-form-urlencoded"
        }

        const formData = new URLSearchParams()
        formData.append("grant_type", "refresh_token")
        formData.append("refresh_token", DROPBOX_CLIENT_REFRESH_TOKEN)

        const response = await fetch(REFRESH_TOKEN_ENDPOINT, {
            method: "POST",
            headers,
            body: formData.toString()
        })

        const data = await response.json()

        return data
    }catch(error){
        console.log(error)
        return null
    }
}

const checkToken = async () => {
    let dropboxAccessToken   = localStorage.getItem(LS_DB_ACC_TKN)
    let dropboxATExpiration  = localStorage.getItem(LS_DB_EXPI)

    let currTime = new Date().getTime()

    // If token exists and not expired
    if(dropboxAccessToken == null || currTime > dropboxATExpiration) {
        // Refresh token
        const { access_token, expires_in } = await requestNewToken()

        dropboxAccessToken = access_token
        let newExpDate = new Date().getTime() + (expires_in * 1000)

        localStorage.setItem(LS_DB_ACC_TKN, access_token)
        localStorage.setItem(LS_DB_EXPI, newExpDate)
    }

    return dropboxAccessToken
}