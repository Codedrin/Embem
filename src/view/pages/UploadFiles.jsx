import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { ArrowUpOnSquareIcon, ChevronLeftIcon } from '@heroicons/react/solid';
import { getDatabase, ref, push, update, onValue } from 'firebase/database';
import { getApp } from '../../config/firebase';
import { useNavigate } from 'react-router-dom'; 
import BG_PHOTO from '../../assets/images/undraw-uploading.svg';
import LOGO from '../../assets/logo.png';
import DROPBOX_LOGO from '../../assets/images/dropbox-logo.png';
import FIREBASE_LOGO from '../../assets/images/firebase-logo.png';

const UploadFiles = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [files, setFiles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const app = getApp(); 
        const database = getDatabase(app);
        const filesRef = ref(database, 'files/');
        onValue(filesRef, (snapshot) => {
            const data = snapshot.val();
            const filesList = data ? Object.values(data) : [];
            setFiles(filesList);
        });
    }, []);

    const handleFileUpload = async () => {
        if (!selectedFile) {
            toast.error('No file selected.');
            return;
        }

        const app = getApp(); 
        const database = getDatabase(app);
        const newFileKey = push(ref(database, 'files')).key;
        const updates = {};
        updates[`/files/${newFileKey}`] = {
            fileName: selectedFile.name,
            path: newFileKey,
            uploadDate: new Date().toISOString()
        };

        try {
            await update(ref(database), updates);
            toast.success('File uploaded successfully!');
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong while uploading the file.');
        }
    };

    const handleChangeChosenFile = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
            setSelectedFile(file);
        } else {
            toast.error('Only PDF and Word files are accepted.');
        }
    };

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
                        accept=".pdf,.docx"
                        onChange={handleChangeChosenFile}
                    />
                    <button
                        className="w-fit bg-primary-50 py-2 px-4 rounded-full text-primary-700 font-bold text-sm hover:bg-primary-100 flex items-center gap-2"
                        onClick={handleFileUpload}
                    >
                        Upload <span><ArrowUpOnSquareIcon className="h-4" /></span>
                    </button>
                </div>
                <div className="w-[50%] hidden md:block">
                    <img src={BG_PHOTO} alt="Background" />
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
        </main>
    );
};

export default UploadFiles;
