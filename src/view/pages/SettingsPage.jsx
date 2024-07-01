import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LOGO from '../../assets/logo.png';
import DROPBOX_LOGO from '../../assets/images/dropbox-logo.png';
import FIREBASE_LOGO from '../../assets/images/firebase-logo.png';
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { getApp } from '../../config/firebase';
import { getDatabase, ref as databaseRef, onValue } from 'firebase/database';

import { LS_SETTINGS, SAVE_SUCCESS, SAVE_FAIL } from "../../utils/constants";

const RESET_TIMESTAMP_KEY = "lastResetTimestamp";

const SettingsPage = () => {
    const navigate = useNavigate();

    const [settings, setSettings] = useState(null);
    const [iBTName, setIBTName] = useState(null);
    const [iBTFolder, setIBTFolder] = useState(null);
    const [iTimeout, setITimeout] = useState(null);
    const [iPassword, setIPassword] = useState(null);

    const [dailyPrintedFiles, setDailyPrintedFiles] = useState(0);
    const [dailyCoinsCollected, setDailyCoinsCollected] = useState(0);

    useEffect(() => {
        const currSettings = JSON.parse(localStorage.getItem(LS_SETTINGS));
        setSettings(currSettings);

        setIBTName(currSettings?.btName);
        setITimeout(currSettings?.timeout);
        setIPassword(currSettings?.password);

        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
        fetchPrintDetails(today);
        checkAndResetCounters();
    }, []);

    useEffect(() => {
        if (settings) {
            // Saves the settings to browser
            localStorage.setItem(LS_SETTINGS, JSON.stringify(settings));
        }
    }, [settings]);

    const fetchPrintDetails = (date) => {
        const app = getApp();
        const database = getDatabase(app);
        const printDetailsRef = databaseRef(database, `printDetails`);

        onValue(printDetailsRef, (snapshot) => {
            const data = snapshot.val();
            let printedFilesCount = 0;
            let coinsCollectedTotal = 0;

            for (let key in data) {
                if (data[key].date.startsWith(date)) {
                    printedFilesCount += data[key].copies;
                    coinsCollectedTotal += data[key].price;
                }
            }

            setDailyPrintedFiles(printedFilesCount);
            setDailyCoinsCollected(coinsCollectedTotal);
        });
    };

    const checkAndResetCounters = () => {
        const lastResetTimestamp = localStorage.getItem(RESET_TIMESTAMP_KEY);
        const now = Date.now();

        if (!lastResetTimestamp || now - lastResetTimestamp > 24 * 60 * 60 * 1000) {
            // More than 24 hours have passed, reset counters
            setDailyPrintedFiles(0);
            setDailyCoinsCollected(0);

            // Update the reset timestamp
            localStorage.setItem(RESET_TIMESTAMP_KEY, now);
        }
    };

    const onChangeTimeout = (e) => {
        const { value } = e.target;
        console.log(value);
        let convertToMilisec = value * 60 * 1000;
        setITimeout(convertToMilisec);
    };

    const handleSave = (e) => {
        e.preventDefault();

        try {
            let newSettings = {
                btName: iBTName,
                btFSrvr: iBTFolder,
                timeout: iTimeout,
                password: iPassword
            };

            // Updates and saves new Settings
            setSettings(newSettings);

            toast.success(SAVE_SUCCESS);
        } catch (error) {
            console.log(error);
            toast.error(SAVE_FAIL);
        }
    };

    const handleBackBtn = (e) => {
        navigate("/admin-access");
    };

    const handleLogout = () => {
        // Clear user session or authentication details
        localStorage.removeItem('user'); // Adjust this to your session management logic
        toast.success('Logged out successfully');
        navigate("/"); // Adjust this to your login page route
    };

    return (
        <main className="min-h-screen w-full flex flex-col">
            <section className="bg-primary-500 h-16 flex items-center justify-center relative">
                <button className="absolute left-4 flex items-center p-4 gap-3" onClick={handleBackBtn}>
                    <ChevronLeftIcon className="h-6 text-white" />
                    <span><h1 className="font-bold text-white">Back</h1></span>
                </button>
                <button className="absolute right-2 flex items-center p-2 gap-3 bg-red-500 hover:bg-red-600 text-white rounded" onClick={handleLogout}>
                    <span>Logout</span>
                </button>
            </section>
            <section className="flex flex-col md:flex-row flex-grow">
                <div className="w-full md:w-1/2 h-full flex flex-col justify-center items-center p-5">
                    <br /> <br />  <br />
                    <div className="text-center md:text-left">
                        <h1 className="text-xl font-bold">Settings</h1>
                        <p className="text-sm text-gray-500">Update the settings according to your preferences</p>
                        <br />
                        <div className="bg-white p-4 rounded shadow mb-4">
                            <h2 className="text-xl font-bold mb-2">Daily Printed Files</h2>
                            <p>{dailyPrintedFiles}</p>
                        </div>
                        <div className="bg-white p-4 rounded shadow">
                            <h2 className="text-xl font-bold mb-2">Daily Coins Collected</h2>
                            <p>{dailyCoinsCollected}</p>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/2 flex justify-center items-center p-5">
                    <form action="" className="flex flex-col gap-4 w-full max-w-md">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-lg font-bold text-primary-500">Bluetooth</h1>
                            <div className="my-2">
                                <h5 className="font-semibold text-sm mb-1 text-gray-900">Bluetooth Name</h5>
                                <p className="text-xs mb-2 text-gray-500">Changed the bluetooth name<br /> according to the device's bluetooth.</p>
                                <input
                                    className="border px-3 py-2 rounded-md text-sm outline-primary-200 w-full"
                                    placeholder="Ex. BT-140"
                                    value={iBTName}
                                    onChange={e => setIBTName(e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-primary-500">Timeout</h1>
                            <div className="my-2">
                                <h5 className="font-semibold text-sm mb-1 text-gray-900">Delete files after (minutes) of being idle</h5>
                                <p className="text-xs mb-2 text-gray-500">Files sent to the server<br /> will be deleted after the given time.</p>
                                <input
                                    className="border px-3 py-2 rounded-md text-sm outline-primary-200 w-full"
                                    placeholder="default 30 mins"
                                    type="number"
                                    value={iTimeout / 60 / 1000}
                                    onChange={onChangeTimeout} />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-primary-500">Administrator</h1>
                            <div className="my-2">
                                <h5 className="font-semibold text-sm mb-1 text-gray-900">Password</h5>
                                <p className="text-xs mb-2 text-gray-500">Change the password to enter this settings option.</p>
                                <input
                                    className="border px-3 py-2 rounded-md text-sm outline-primary-200 w-full"
                                    type="password"
                                    placeholder=""
                                    value={iPassword}
                                    onChange={e => setIPassword(e.target.value)} />
                            </div>
                        </div>
                        <div className="">
                            <button
                                className="mt-2 bg-secondary-50 px-4 py-1 hover:bg-secondary-100 border rounded text-sm font-semibold text-secondary-700 flex items-center gap-2"
                                onClick={handleSave}>Save</button>
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

export default SettingsPage;
