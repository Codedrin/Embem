import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import LOGO from '../../assets/logo.png';
import DROPBOX_LOGO from '../../assets/images/dropbox-logo.png';
import FIREBASE_LOGO from '../../assets/images/firebase-logo.png';

import { useEffect, useState } from "react";

import { LS_SETTINGS, LOGIN_SUCCESS, LOGIN_FAIL } from "../../utils/constants";

const AdminAccess = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        // Retrieve settings from local storage
        const loadSettings = JSON.parse(localStorage.getItem(LS_SETTINGS));
        setSettings(loadSettings);
    }, []);

    const handleBackBtn = () => {
        navigate("/");
    };




    const handleSubmitBtn = (e) => {
        e.preventDefault();

        // Retrieve saved password from settings
        const savedPassword = settings?.password;

        if (password === savedPassword) {
            toast.success(LOGIN_SUCCESS);
            navigate("/settings");
        } else {
            toast.error(LOGIN_FAIL);
        }
    };

    return (
        <main className="h-[100vh] w-[100vw]">
         <section className="bg-primary-500 h-[8%] flex items-center justify-center relative">
                <button className="absolute left-4 flex items-center p-4 gap-3" onClick={handleBackBtn}>
                    <ChevronLeftIcon className="h-6 text-white" />
                    <span><h1 className="font-bold text-white">Back</h1></span>
                </button>
                
            </section>
            <section className="h-[90%] flex">
                <div className="w-[50%] h-full bg-primary-100 flex justify-center items-center">
                    <div className="">
                        <h1 className="text-xl font-bold">Administrator Only</h1>
                        <p className="text-sm text-gray-500">This is an administrator only access.</p>
                    </div>
                </div>
                <div className="w-[50%] flex justify-center items-center">
                    <form action="" className="flex flex-col gap-2">
                        <div className="my-2">
                            <h5 className="font-semibold text-sm mb-1 text-gray-900 flex items-center gap-2">Password</h5>
                            <p className="text-xs mb-2 text-gray-500">To commit changes in this system, <br/>you must enter the administrator password.</p>
                            <input 
                                className="border px-3 py-2 rounded-md text-sm outline-primary-200" 
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
    );
};

export default AdminAccess;
