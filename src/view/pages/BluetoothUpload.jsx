import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PrinterIcon, ChevronLeftIcon, FolderOpenIcon } from '@heroicons/react/24/solid';
import DocumentView from '../components/DocumentView';
import { LS_SETTINGS } from '../../utils/constants';
import LOGO from '../../assets/logo.png';
import DROPBOX_LOGO from '../../assets/images/dropbox-logo.png';
import FIREBASE_LOGO from '../../assets/images/firebase-logo.png';


const BluetoothUpload = () => {
    const [settings, setSettings] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFileName, setSelectedFileName] = useState(null);
    const [fileType, setFileType] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const loadedSettings = JSON.parse(localStorage.getItem(LS_SETTINGS));
        setSettings(loadedSettings);
    }, []);

    const handleBackBtn = () => {
        navigate('/');
    };

    const handleReloadBTServer = async () => {
        try {
            const [fileHandle] = await window.showOpenFilePicker({
                types: [
                    {
                        description: 'Documents',
                        accept: {
                            'application/pdf': ['.pdf'],
                        },
                    },
                ],
                excludeAcceptAllOption: true,
                multiple: false,
            });
            const file = await fileHandle.getFile();
            setSelectedFileName(file.name);

            const arrBuffer = await file.arrayBuffer();
            const blob = new Blob([arrBuffer], { type: file.type });
            setSelectedFile(blob);
            setFileType(file.type.split('/')[1]);

            console.log('File selected:', file.name, fileType);
        } catch (error) {
            console.error('Error loading file: ', error);
        }
    };

    const handlePrintBtn = (e) => {
        navigate("/view", {
            state: {
                bt_file   : selectedFile,
                file_name : selectedFileName
            }
        })
    }


    return (
        <main className="h-screen w-screen flex flex-col">
            <header className="bg-primary-500 h-16 flex items-center justify-center relative">
                <button className="absolute left-4 flex items-center p-4 gap-3" onClick={handleBackBtn}>
                    <ChevronLeftIcon className="h-6 text-white" />
                    <span><h1 className="font-bold text-white">Choose an upload method</h1></span>
                </button>
            </header>
            <section className="flex flex-col md:flex-row flex-grow items-center">
                <div className="flex flex-col items-center justify-center h-full w-full md:w-1/2 p-5">
                    <h1 className="text-md">Please connect and send files to bluetooth name</h1>
                    <h1 className="text-xl font-bold text-primary-500">{settings?.btName}</h1>
                    <div>
                        <button
                            className="rounded-full py-2 px-4 font-bold text-primary-500 bg-primary-50 hover:bg-primary-100 mt-5 flex items-center gap-2"
                            onClick={handleReloadBTServer}
                        >
                            Pick a sent file<span>
                                <FolderOpenIcon className="h-5" />
                            </span>
                        </button>
                        {selectedFile && (
                            <button
                                className="rounded-full py-2 px-4 font-bold text-primary-500 bg-primary-50 hover:bg-primary-100 mt-5 flex items-center gap-2"
                                onClick={handlePrintBtn}
                            >
                                Print<span>
                                    <PrinterIcon className="h-5" />
                                </span>
                            </button>
                        )}
                    </div>
                </div>
                <div className="w-full md:w-1/2 h-full p-5 overflow-auto">
                    <DocumentView file={selectedFile} fileType={fileType} onLoad={() => { }} />
                </div>
            </section>
            <footer className="bg-primary-500 h-24 flex items-center justify-center">
                <div className="mt-5">
                    <p className="text-sm text-gray-300">Powered by</p>
                    <ul className="flex gap-2 justify-center">
                        <li><img src={LOGO} className="h-10 grayscale" alt="Logo" /></li>
                        <li><img src={DROPBOX_LOGO} className="h-10 grayscale" alt="Dropbox Logo" /></li>
                        <li><img src={FIREBASE_LOGO} className="h-10 grayscale" alt="Firebase Logo" /></li>
                    </ul>
                </div>
            </footer>
        </main>
    );
};

export default BluetoothUpload;
