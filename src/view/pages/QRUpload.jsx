
import FileContainer from "../components/FileContainer"
import { TrashIcon, ChevronLeftIcon } from "@heroicons/react/24/solid"
import QRCode from "react-qr-code"
import LOGO from '../../assets/logo.png';
import DROPBOX_LOGO from '../../assets/images/dropbox-logo.png';
import FIREBASE_LOGO from '../../assets/images/firebase-logo.png';
import { useState, useEffect } from "react";
import { deleteFiles, readFiles } from "../../controller/FirebaseAPI";
import { deleteFiles as deleteFilesDROPBOX } from "../../controller/DropboxAPI"
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

import { DELETE_FILES_ERROR, DELETE_FILES_SUCCESS } from "../../utils/constants";

const QRUpload = () => {

    const navigate = useNavigate()
    const [files, setFiles] = useState([])

    useEffect(() => {
        readFiles((snapshot) => {
            let data = snapshot.val()
            let filesInfo = []

            for(let key in data) {
                filesInfo = [...filesInfo, data[key]]
            }

            setFiles(filesInfo)
        })
    }, [])
    const handleSettingsIcon = (e) => {
        navigate("/admin-access");
    }
    const handleHomeClick = () => {
        navigate("/");
    }

    const handleRemoveAll = (e) => {
        try{
            let entries = files.map(f => {
                return { path: f.file_path }
            })

            const fileDeletionProgress = deleteFilesDROPBOX(entries)
            if(fileDeletionProgress) {
                deleteFiles()
                console.log(DELETE_FILES_SUCCESS)
                toast.success(DELETE_FILES_SUCCESS)
            }else{
                throw new Error(DELETE_FILES_ERROR)
            }
        }catch(error) {
            console.log(error)
            toast.error(error)
        }
    }

    const handleBackBtn = (e) => {
        navigate("/")
    }
    const localIP = "http://192.168.1.100:3000"; 
    const QR_VALUE = localIP + "/upload";
    return (
        <main className="w-[100vw] h-[100vh]">
             <section className="bg-primary-500 h-[8%] flex items-center justify-center relative">
                <h1 
                    className="text-white text-2xl font-bold cursor-pointer"
                    onClick={handleHomeClick}
                >
                    E M B E M
                </h1>
            </section>
            <section className="h-[80%] flex md:flex-row flex-col items-center justify-center p-5">
                <div className="w-[50%] flex flex-col items-center">
                    <div className="bg-primary-500 w-fit rounded-lg p-3">
                        <QRCode
                            size={256}
                            style={{ height: "auto", maxWidth: "256px", width: "256px" }}
                            value={QR_VALUE}
                            viewBox="0 0 256 256" />
                    </div>
                    <div className="bg-primary-500 p-2 mt-2 rounded w-fit">
                        <h1 className="font-bold text-white">Scan this QR</h1>
                    </div>
                </div>
                <div className="w-[50%] p-5">
                    <FileContainer files={files} />
                    <button className="flex items-center px-4 py-2 rounded-full bg-danger-50 text-danger-700 hover:bg-danger-100 font-bold text-sm gap-2 m-2"
                        onClick={handleRemoveAll}>Clear Files <TrashIcon className="h-6" /></button>
                </div>
                </section>
                <section className="h-[12%] bg-primary-500  flex items-center justify-center">
                <div className="mt-5">
                    <p className="text-sm text-gray-300">Powered by</p>
                    <ul className="flex gap-2">
                        <li><img src={LOGO} className="h-10 grayscale" /></li>
                        <li><img src={DROPBOX_LOGO} className="h-10 grayscale" /></li>
                        <li><img src={FIREBASE_LOGO} className="h-10 grayscale" /></li>
                    </ul>
                </div>
          

            </section>
        </main>
    )
}

export default QRUpload