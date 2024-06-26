import React from 'react';
import LOGO from '../../assets/logo.png';
import DROPBOX_LOGO from '../../assets/images/dropbox-logo.png';
import FIREBASE_LOGO from '../../assets/images/firebase-logo.png';
import ADMIN_LOGO from '../../assets/admin.png';
import { toast } from "react-toastify";
import { QrCodeIcon, ArrowUpTrayIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

const FileUploadMethodPage = () => {
    const navigate = useNavigate();

    const back = (e) => {
        navigate("/");
    }

    const onclick = () => {
        toast.warn("This function is not implemented yet.");
    }

    const handleQrBtn = (e) => {
        navigate("/qr-upload");
    }

    const handleSettingsIcon = (e) => {
        navigate("/admin-access");
    }

    const handleHomeClick = () => {
        navigate("/");
    }

    const handleBTBtn = (e) => {
        navigate("/bt-upload");
    }

    return (
        <main className="w-full h-screen flex flex-col">
            <section className="bg-primary-500 h-16 flex items-center justify-center relative">
                <h1 
                    className="text-white text-2xl font-bold cursor-pointer"
                    onClick={handleHomeClick}
                >
                    E M B E M
                </h1>
                <img
                    src={ADMIN_LOGO}
                    alt="Admin"
                    className="absolute right-4 h-8 cursor-pointer mr-2 grayscale"
                    onClick={handleSettingsIcon}
                />
            </section>
            <section className="flex flex-col md:flex-row items-center justify-center flex-grow p-5">
                <div className="w-full md:w-1/2 p-5 bg-primary-500 rounded-lg mb-5 md:mb-0 md:mr-2 text-center md:text-left flex flex-col items-center md:items-start">
                    <h1 className="text-md text-white">Upload files by</h1>
                    <div className="flex flex-row items-center gap-2">
                        <h1 className="text-[3rem] text-white font-bold">QR CODE</h1>
                        <QrCodeIcon className="h-14 text-white" />
                    </div>
                    <p className="text-sm text-gray-50">Scan the code using your device and upload your file.</p>
                    <button className="bg-secondary-50 px-4 py-1 rounded-full text-secondary-900 text-lg font-bold mt-5" onClick={handleQrBtn}>Continue with QR</button>
                </div>
                <div className="w-full md:w-1/2 p-5 bg-white rounded-lg text-center md:text-left flex flex-col items-center md:items-start">
                    <h1 className="text-md text-primary-500">Upload files by</h1>
                    <div className="flex flex-row items-center gap-2">
                        <h1 className="text-[3rem] text-primary-600 font-bold">Bluetooth</h1>
                        <ArrowUpTrayIcon className="h-10 text-primary-600" />
                    </div>
                    <p className="text-sm text-gray-400">Connect and pair your device's bluetooth and send your file.</p>
                    <button className="bg-primary-300 px-4 py-1 rounded-full hover:ring-1 ring-primary-400 text-primary-900 text-lg font-bold mt-5" onClick={handleBTBtn}>Continue with Bluetooth</button>
                </div>
            </section>
            <section className="h-24 bg-primary-500 flex items-center justify-center">
                <div className="mt-5">
                    <p className="text-sm text-gray-300">Powered by</p>
                    <ul className="flex gap-2 justify-center">
                        <li><img src={LOGO} className="h-10 grayscale" alt="Logo" /></li>
                        <li><img src={DROPBOX_LOGO} className="h-10 grayscale" alt="Dropbox Logo" /></li>
                        <li><img src={FIREBASE_LOGO} className="h-10 grayscale" alt="Firebase Logo" /></li>
                    </ul>
                </div>
            </section>
        </main>
    );
}

export default FileUploadMethodPage;
