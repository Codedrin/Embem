import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import LOGO from '../../assets/logo.png';
import DROPBOX_LOGO from '../../assets/images/dropbox-logo.png';
import FIREBASE_LOGO from '../../assets/images/firebase-logo.png';

import { useState } from "react";

import { LOGIN_SUCCESS, LOGIN_FAIL } from "../../utils/constants";

const AdminAccess = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");

    const handleBackBtn = () => {
        navigate(-1);
    };

    const handleSubmitBtn = (e) => {
        e.preventDefault();

        const savedPassword = import.meta.env.VITE_ADMIN_PASSWORD;

        if (password === savedPassword) {
            toast.success(LOGIN_SUCCESS);
            navigate("/settings");
        } else {
            toast.error(LOGIN_FAIL);
        }
    };

    return (
        <main className="h-screen w-full flex flex-col">
            <section className="bg-primary-500 h-16 flex items-center justify-center relative">
                <button className="absolute left-4 flex items-center p-4 gap-3" onClick={handleBackBtn}>
                    <ChevronLeftIcon className="h-6 text-white" />
                    <span><h1 className="font-bold text-white">Back</h1></span>
                </button>
            </section>
            <section className="flex flex-grow flex-col md:flex-row">
                <div className="w-full md:w-1/2 h-full bg-primary-100 flex justify-center items-center p-5">
                    <div className="text-center md:text-left">
                        <h1 className="text-xl font-bold">Administrator Only</h1>
                        <p className="text-sm text-gray-500">This is an administrator only access.</p>
                    </div>
                </div>
                <div className="w-full md:w-1/2 flex justify-center items-center p-5">
                    <form action="" className="flex flex-col gap-2 w-full max-w-md">
                        <div className="my-2">
                            <h5 className="font-semibold text-sm mb-1 text-gray-900 flex items-center gap-2">Password</h5>
                            <p className="text-xs mb-2 text-gray-500">To commit changes in this system, <br/>you must enter the administrator password.</p>
                            <input 
                                className="border px-3 py-2 rounded-md text-sm outline-primary-200 w-full" 
                                type="password" 
                                placeholder=""
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                        <div className="mt-2">
                            <button 
                                onClick={handleSubmitBtn}
                                className="mt-2 bg-secondary-50 px-4 py-1 hover:bg-secondary-100 border rounded text-sm font-semibold text-secondary-700 flex items-center gap-2">Submit</button>
                        </div>
                    </form>
                </div>
            </section>
            <section className="bg-primary-500 flex items-center justify-center py-4">
                <div className="text-center">
                    <p className="text-sm text-gray-300">Powered by</p>
                    <ul className="flex gap-2 justify-center mt-2">
                        <li><img src={LOGO} className="h-10 grayscale" /></li>
                        <li><img src={DROPBOX_LOGO} className="h-10 grayscale" /></li>
                        <li><img src={FIREBASE_LOGO} className="h-10 grayscale" /></li>
                    </ul>
                </div>
            </section>
        </main>
    );
};

export default AdminAccess;
