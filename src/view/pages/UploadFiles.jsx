import { uploadFile } from "../../controller/DropboxAPI";
import { addFile, readFiles } from "../../controller/FirebaseAPI";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { ArrowUpOnSquareIcon, ChevronLeftIcon } from "@heroicons/react/24/solid";
import BG_PHOTO from '../../assets/images/undraw-uploading.svg';
import { UPLOAD_SUCCESS, UPLOAD_ERROR } from "../../utils/constants";
import LOGO from '../../assets/logo.png';
import DROPBOX_LOGO from '../../assets/images/dropbox-logo.png';
import FIREBASE_LOGO from '../../assets/images/firebase-logo.png';

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
        if (!selectedFile) {
            toast.error("No file selected");
            return;
        }

        const uploadAndAddToFirebase = async () => {
            try {
                const ufRes = await uploadFile(selectedFile);
                if (ufRes.status !== 200) {
                    throw new Error('File upload failed');
                }

                const { data } = ufRes;
                const { name: fileName, path_display: path } = data;

                const newFile = {
                    fileName,
                    path,
                    upload_date: new Date().toISOString()
                };

                await addFile(newFile);
                toast.success(UPLOAD_SUCCESS);
            } catch (error) {
                console.error("Error uploading file:", error);
                toast.error(UPLOAD_ERROR);
            }
        }

        uploadAndAddToFirebase();
    }

    const handleChangeChosenFile = (e) => {
        let file = e.target.files[0];

        if (!file) {
            toast.error("No file selected");
            return;
        }

        const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
        if (!allowedTypes.includes(file.type)) {
            toast.error("Only PDF and Word files are accepted");
            setSelectedFile(null);
            return;
        }

        setSelectedFile(file);
    }

    const handleBackBtn = () => {
        navigate("/");
    };

    return (
        <main className="w-[100vw] h-[100vh]">
            <section className="bg-primary-500 h-[8%] flex items-center justify-center relative">
                <button className="absolute left-4 flex items-center p-4 gap-3" onClick={handleBackBtn}>
                    <ChevronLeftIcon className="h-6 text-white" />
                    <span><h1 className="font-bold text-white">Go back</h1></span>
                </button>
            </section>
            <section className="h-[80%] flex items-center">
                <div className="w-[100%] md:w-[50%] p-5 flex flex-col gap-4">
                    <h1 className="text-primary-500 font-bold">Upload your chosen file here</h1>
                    <input 
                        type="file" 
                        className="block w-full text-sm text-primary-500
                        file:mr-2 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-primary-50 file:text-primary-700
                        hover:file:bg-primary-100
                        file:cursor-pointer" 
                        accept=".pdf,.doc,.docx"
                        onChange={handleChangeChosenFile} 
                    />
                    <button 
                        className="w-fit bg-primary-50 py-2 px-4 rounded-full text-primary-700 font-bold text-sm hover:bg-primary-100 flex items-center gap-2"
                        onClick={handleFileUpload}>
                        Upload <span><ArrowUpOnSquareIcon className="h-4" /></span>
                    </button>
                </div>
                <div className="w-[50%] hidden md:block">
                    <img src={BG_PHOTO} alt="" />
                </div>
            </section>
            <section className="h-[12%] bg-primary-500 flex items-center justify-center">
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

export default UploadFiles;
