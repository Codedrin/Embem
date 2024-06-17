import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  useNavigate
} from "react-router-dom"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

  

import FileUploadMethodPage from './view/pages/FileUploadMethodPage.jsx'
import QRUpload from "./view/pages/QRUpload.jsx"
import UploadFiles from "./view/pages/UploadFiles.jsx"
import DocumentViewer from "./view/pages/DocumentViewer.jsx"
import BluetoothUpload from "./view/pages/BluetoothUpload.jsx"
import PrintProcessPage from "./view/pages/PrintProcessPage.jsx"
import SettingsPage from "./view/pages/SettingsPage.jsx"
import AdminAccess from "./view/pages/AdminAccess.jsx"

import { pdfjs } from "react-pdf";
import { deleteFiles, readFilesOnce } from "./controller/FirebaseAPI.jsx"
import { deleteFiles as deleteFilesDROPBOX } from "./controller/DropboxAPI"
import { useEffect, useState } from "react"

import { LS_SETTINGS, DELETE_FILES_DUE_TO_INACTIVITY } from "./utils/constants.jsx"
import { useIdleTimeout } from "./view/hooks/useIdle.jsx"
import Maintenance from "./view/pages/MaintenancePage.jsx"


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url
).toString()

const App = () => {

  const [settings, setSettings] = useState({})

  const defaultSettings = {
    btName   : "EMBEM-BT-140",
    timeout  : 30 * 60 * 1000,
    password : import.meta.env.VITE_ADMIN_PASSWORD
  }

  useEffect(() => {
    const currSettings = JSON.parse(localStorage.getItem(LS_SETTINGS))

    // Set a default value.
    if(currSettings == null || currSettings == undefined) {
      localStorage.setItem(LS_SETTINGS, JSON.stringify(defaultSettings))
    }

    setSettings(currSettings)
  }, [])

  const onIdle = () => {
    console.info("IDLE AT : " + new Date().getTime())

    readFilesOnce((snapshot) => {
      const data = snapshot.val()

      let files = []
      for (let key in data) {
        files = [...files, data[key]]
      }

      if(files.length > 0) {
        files = files.map(file => {
          return {
            path: file.file_path
          }
        })
  
        deleteFilesDROPBOX(files)
        deleteFiles()
  
        toast.info(DELETE_FILES_DUE_TO_INACTIVITY)
      }
    })
  }

  const { isIdle } = useIdleTimeout({onIdle, idleTime: settings?.timeout ? settings.timeout : defaultSettings.timeout})

  const SERVER_STATUS = import.meta.env.VITE_SERVER_STATUS

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" >
   <Route path="/" element={<FileUploadMethodPage />} />
        <Route path="/qr-upload" element={<QRUpload />}/>
        <Route path="/upload" element={<UploadFiles />} />
        <Route path="/view" element={<DocumentViewer /> } />
        <Route path="/bt-upload" element={<BluetoothUpload />} />
        <Route path="/print" element={<PrintProcessPage />} />
        <Route path="/settings" element={<SettingsPage /> } />
        <Route path="/admin-access" element={<AdminAccess />} />

      </Route>
    )
  )

  if(SERVER_STATUS == "MAINTENANCE") {
    return (
      <>
        <Maintenance />
      </>
    )
  }

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-left"
        autoClose={5000}
        hideProgressBar={true}
      />
    </>
  )
}

export default App;