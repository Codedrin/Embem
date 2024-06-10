import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import QRCode from 'react-qr-code';
import { TrashIcon } from '@heroicons/react/24/solid';
import FileContainer from '../components/FileContainer';
import { readFiles, deleteFiles } from '../../controller/FirebaseAPI';
import { DELETE_FILES_ERROR, DELETE_FILES_SUCCESS } from '../../utils/constants';
import LOGO from '../../assets/logo.png';
import DROPBOX_LOGO from '../../assets/images/dropbox-logo.png';
import FIREBASE_LOGO from '../../assets/images/firebase-logo.png';

const QRUpload = () => {
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);

    useEffect(() => {
        readFiles((snapshot) => {
            const data = snapshot.val();
            const filesInfo = data ? Object.keys(data).map(key => ({ ...data[key], key })) : [];
            setFiles(filesInfo);
        });
    }, []);

    const handleRemoveAll = async () => {
        try {
            await deleteFiles();
            toast.success(DELETE_FILES_SUCCESS);
            setFiles([]); // Clear local state
        } catch (error) {
            console.error(error);
            toast.error(DELETE_FILES_ERROR);
        }
    };

    const handleFileClick = (file) => {
        navigate('/view', {
            state: {
                file_path: file.file_path,
                file_name: file.file_name,
            }
        });
    };

    return (
        <main className="min-h-screen flex flex-col">
            <section className="bg-primary-500 h-16 flex items-center justify-center relative">
                <h1 className="text-white text-2xl font-bold cursor-pointer">
                    E M B E M
                </h1>
            </section>
            <section className="flex flex-col md:flex-row items-center justify-center flex-grow p-5">
                <div className="w-full md:w-1/2 flex flex-col items-center mb-5 md:mb-0">
                    <div className="bg-primary-500 rounded-lg p-3">
                        <QRCode size={256} value={window.location.origin + '/upload'} />
                    </div>
                    <div className="bg-primary-500 p-2 mt-2 rounded">
                        <h1 className="font-bold text-white">Scan this QR</h1>
                    </div>
                </div>
                <div className="w-full md:w-1/2 p-5">
                    <FileContainer files={files} onFileClick={handleFileClick} />
                    <button
                        className="flex items-center px-4 py-2 rounded-full bg-danger-50 text-danger-700 hover:bg-danger-100 font-bold text-sm gap-2 mt-2"
                        onClick={handleRemoveAll}
                    >
                        Clear Files <TrashIcon className="h-6" />
                    </button>
                </div>
            </section>
            <section className="bg-primary-500 flex items-center justify-center py-4">
                <div className="text-center">
                    <p className="text-sm text-gray-300">Powered by</p>
                    <ul className="flex gap-2 justify-center mt-2">
                        <li><img src={LOGO} className="h-10 grayscale" alt="Logo" /></li>
                        <li><img src={DROPBOX_LOGO} className="h-10 grayscale" alt="Dropbox Logo" /></li>
                        <li><img src={FIREBASE_LOGO} className="h-10 grayscale" alt="Firebase Logo" /></li>
                    </ul>
                </div>
            </section>
        </main>
    );
};

export default QRUpload;
