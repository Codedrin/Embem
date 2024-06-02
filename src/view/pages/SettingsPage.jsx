import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import LOGO from '../../assets/logo.png';
import DROPBOX_LOGO from '../../assets/images/dropbox-logo.png';
import FIREBASE_LOGO from '../../assets/images/firebase-logo.png';
import { ChevronLeftIcon } from "@heroicons/react/24/solid"
import { useNavigate } from "react-router-dom"

import { LS_SETTINGS, SAVE_SUCCESS, SAVE_FAIL } from "../../utils/constants"

const SettingsPage = () => {

    const navigate = useNavigate()

    const [settings, setSettings]   = useState(null)
    const [iBTName, setIBTName]     = useState(null)
    const [iBTFolder, setIBTFolder] = useState(null)
    const [iTimeout, setITimeout]   = useState(null)
    const [iPassword, setIPassword] = useState(null)

    useEffect(() => {
        const currSettings = JSON.parse(localStorage.getItem(LS_SETTINGS))
        setSettings(currSettings)

        setIBTName(currSettings?.btName)
        setITimeout(currSettings?.timeout)
        setIPassword(currSettings?.password)
    }, [])

    useEffect(() => {
        if(settings) {
            // Saves the settings to browser
            localStorage.setItem(LS_SETTINGS, JSON.stringify(settings))
        }
    }, [settings])

    const onChangeTimeout = (e) => {
        const { value } = e.target
        console.log(value)
        let convertToMilisec = value * 60 * 1000
        setITimeout(convertToMilisec)
    }

    const handleSave = (e) => {
        e.preventDefault()

        try{
            let newSettings = {
                btName   : iBTName,
                btFSrvr  : iBTFolder,
                timeout  : iTimeout,
                password : iPassword
            }
            
            // Updates and saves new Settings
            setSettings(newSettings)

            toast.success(SAVE_SUCCESS)
        }catch(error){
            console.log(error)
            toast.error(SAVE_FAIL)
        }
    }

    const handleBackBtn = (e) => {
        navigate("/admin-access")
    }

    return (
        <main className="h-[100vh] w-[100vw] flex-col">
  <section className="bg-primary-500 h-[8%] flex items-center justify-center relative">
                <button className="absolute left-4 flex items-center p-4 gap-3" onClick={handleBackBtn}>
                    <ChevronLeftIcon className="h-6 text-white" />
                    <span><h1 className="font-bold text-white">Back</h1></span>
                </button>
   
            </section>
            
            <section className="h-[90%] flex">
                <div className="w-[50%] h-full bg-primary-50 flex flex-col justify-center items-center">
                    <div className="">
                        <h1 className="text-xl font-bold">Settings</h1>
                        <p className="text-sm text-gray-500">Update the settings according to your preferences</p>
                    </div>
                </div>
                <div className="w-[50%] flex justify-center items-center">
                    <form action="" className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-lg font-bold text-primary-500">Bluetooth</h1>
                            <div className="my-2">
                                <h5 className="font-semibold text-sm mb-1 text-gray-900 flex items-center gap-2">Bluetooth Name</h5>
                                <p className="text-xs mb-2 text-gray-500">Changed the bluetooth name<br/> according to the device's blueooth.</p>
                                <input 
                                    className="border px-3 py-2 rounded-md text-sm outline-primary-200" 
                                    placeholder="Ex. BT-140"
                                    value={iBTName}
                                    onChange={e => setIBTName(e.target.value)}/>
                            </div>
                            {/* <div className="my-2">
                                <h5 className="font-semibold text-sm mb-1 text-gray-900 flex items-center gap-2">Bluetooth Folder</h5>
                                <p className="text-xs mb-2 text-gray-500">Choose the path of where should the<br/> bluetooth files go</p>
                                <input 
                                    className="border px-3 py-2 rounded-md text-sm outline-primary-200" 
                                    type="url"
                                    placeholder="C:/"
                                    value={iBTFolder}
                                    onChange={e => setIBTFolder(e.target.value)}/>
                            </div> */}
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-primary-500">Timeout</h1>
                            <div className="my-2">
                                <h5 className="font-semibold text-sm mb-1 text-gray-900 flex items-center gap-2">Delete files after (minutes) of being idle</h5>
                                <p className="text-xs mb-2 text-gray-500">Files sent to the server<br/> will be deleted after the given time.</p>
                                <input 
                                    className="border px-3 py-2 rounded-md text-sm outline-primary-200" 
                                    placeholder="default 30 mins"
                                    type="number"
                                    value={iTimeout / 60 / 1000}
                                    onChange={onChangeTimeout}/>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-primary-500">Administrator</h1>
                            <div className="my-2">
                                <h5 className="font-semibold text-sm mb-1 text-gray-900 flex items-center gap-2">Password</h5>
                                <p className="text-xs mb-2 text-gray-500">Change the password to enter this settings option.</p>
                                <input 
                                    className="border px-3 py-2 rounded-md text-sm outline-primary-200" 
                                    type="password" 
                                    placeholder=""
                                    value={iPassword}
                                    onChange={e => setIPassword(e.target.value)}/>
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

export default SettingsPage