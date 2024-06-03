<<<<<<< HEAD
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ChevronLeftIcon, ArrowUpOnSquareIcon } from "@heroicons/react/24/solid";
import Button from "../components/Button";
import FileContainer from "../components/FileContainer";
import Logo from "../components/Logo";
import LOGO from '../../assets/logo.png';
import DROPBOX_LOGO from '../../assets/images/dropbox-logo.png';
import FIREBASE_LOGO from '../../assets/images/firebase-logo.png';
import BG_PHOTO from '../../assets/images/undraw-uploading.svg';
import { uploadFile } from "../../controller/DropboxAPI";
import { addFile, readFiles } from "../../controller/FirebaseAPI";
import { UPLOAD_SUCCESS, UPLOAD_ERROR } from "../../utils/constants";
=======
import Button from "../components/Button"
import FileContainer from "../components/FileContainer"
import Logo from "../components/Logo"
import LOGO from '../../assets/logo.png';
import DROPBOX_LOGO from '../../assets/images/dropbox-logo.png';
import FIREBASE_LOGO from '../../assets/images/firebase-logo.png';
import { PrinterIcon, ChevronLeftIcon, FolderOpenIcon } from "@heroicons/react/24/solid";
import { 
    TrashIcon,
    ArrowUpOnSquareIcon 
} from "@heroicons/react/24/solid"

import { uploadFile } from "../../controller/DropboxAPI"
import { addFile, readFiles } from "../../controller/FirebaseAPI"
import { toast } from "react-toastify"

import { useState, useEffect } from "react"

import BG_PHOTO from '../../assets/images/undraw-uploading.svg'

import { UPLOAD_SUCCESS, UPLOAD_ERROR } from "../../utils/constants"
>>>>>>> 2f2fdb61575cbeed54ac9226db4f74afb8af153b

const UploadFiles = () => {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        readFiles((snapshot) => {
            const data = snapshot.val();
            let filesInfo = [];

            for (let key in data) {
                filesInfo = [...filesInfo, data[key]];
            }

            setFiles(filesInfo);
        });
    }, []);

    const handleFileUpload = (e) => {
        e.preventDefault();

        if (!selectedFile) {
            toast.error("Please select a file first.");
            return;
        }

        const uploadAndAddToFirebase = async () => {
            try {
                const ufRes = await uploadFile(selectedFile);
                if (ufRes.status !== 200) {
                    throw new Error(UPLOAD_ERROR);
                }
                const { name: fileName, path_display: path } = ufRes.data;

                let newFile = {
                    fileName,
                    path
                };

                await addFile(newFile);
                toast.success(UPLOAD_SUCCESS);
            } catch (error) {
                console.error(error);
                toast.error(UPLOAD_ERROR);
            }
        };

        uploadAndAddToFirebase();
    };

    const handleChangeChosenFile = (e) => {
        let file = e.target.files[0];

        // Check if the file is a PDF or DOCX
        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!validTypes.includes(file.type)) {
            toast.error("Only PDF and Word files are accepted.");
            setSelectedFile(null);
            return;
        }

<<<<<<< HEAD
        setSelectedFile(file);
    };

    const handleBackBtn = () => {
        navigate("/");
    };

    return (
        <main className="w-[100vw] h-[100vh]">
            <section className="bg-primary-500 h-[8%] flex items-center justify-center relative">
=======
        setSelectedFile(file)
    }
    const handleBackBtn = () => {
        navigate("/");
    };
    return (
        <main className="w-[100vw] h-[100vh]">
                     <section className="bg-primary-500 h-[8%] flex items-center justify-center relative">
>>>>>>> 2f2fdb61575cbeed54ac9226db4f74afb8af153b
                <button className="absolute left-4 flex items-center p-4 gap-3" onClick={handleBackBtn}>
                    <ChevronLeftIcon className="h-6 text-white" />
                    <span><h1 className="font-bold text-white">Go back</h1></span>
                </button>
<<<<<<< HEAD
=======
             
>>>>>>> 2f2fdb61575cbeed54ac9226db4f74afb8af153b
            </section>
            <section className="h-[80%] flex items-center">
                <div className="w-[100%] md:w-[50%] p-5 flex flex-col gap-4">
                    <h1 className="text-primary-500 font-bold">Upload your chosen file here</h1>
                    <input type="file" className="block w-full text-sm text-primary-500
                        file:mr-2 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-primary-50 file:text-primary-700
                        hover:file:bg-primary-100
                        file:cursor-pointer"
                        accept=".pdf,.docx"
                        onChange={handleChangeChosenFile} />
                    <button 
                        className="w-fit bg-primary-50 py-2 px-4 rounded-full text-primary-700 font-bold text-sm hover:bg-primary-100 flex items-center gap-2"
                        onClick={handleFileUpload}>Upload <span><ArrowUpOnSquareIcon className="h-4" /></span></button>
                </div>
                <div className="w-[50%] hidden md:block">
                    <img src={BG_PHOTO} alt="Upload Illustration" />
                </div>
            </section>
            <section className="h-[12%] bg-primary-500 flex items-center justify-center">
                <div className="mt-5">
                    <p className="text-sm text-gray-300">Powered by</p>
                    <ul className="flex gap-2">
                        <li><img src={LOGO} className="h-10 grayscale" alt="Logo" /></li>
                        <li><img src={DROPBOX_LOGO} className="h-10 grayscale" alt="Dropbox Logo" /></li>
                        <li><img src={FIREBASE_LOGO} className="h-10 grayscale" alt="Firebase Logo" /></li>
                    </ul>
                </div>
            </section>
<<<<<<< HEAD
=======
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
>>>>>>> 2f2fdb61575cbeed54ac9226db4f74afb8af153b
        </main>
    );
};

<<<<<<< HEAD
export default UploadFiles;
=======
export default UploadFiles
>>>>>>> 2f2fdb61575cbeed54ac9226db4f74afb8af153b
