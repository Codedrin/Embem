import { useEffect, useState } from "react";
import { PrinterIcon, ChevronLeftIcon, FolderOpenIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import DocumentView from "../components/DocumentView";
import { LS_SETTINGS } from "../../utils/constants";

const BluetoothUpload = () => {
    const [settings, setSettings] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFileName, setSelectedFileName] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const loadedSettings = JSON.parse(localStorage.getItem(LS_SETTINGS));
        setSettings(loadedSettings);
    }, []);

    const handleBackBtn = () => {
        navigate("/");
    };

    const handleReloadBTServer = (event) => {
        (async () => {
            const [fileHandle] = await window.showOpenFilePicker({
                types: [
                    {
                        description: "Documents",
                        accept: {
                            "pdf/*": [".pdf"]
                        }
                    }
                ],
                excludeAcceptAllOption: true,
                multiple: false,
            });
            const file = await fileHandle.getFile();
            setSelectedFileName(file.name);

            const arrBuffer = await file.arrayBuffer();

            const blob = new Blob([arrBuffer], { type: "application/pdf" });
            setSelectedFile(blob);
        })();
    };

    const handlePrintBtn = (e) => {
        navigate("/view", {
            state: {
                bt_file: selectedFile,
                file_name: selectedFileName
            }
        });
    };



    return (
        <main className="h-[100vh] w-[100vw]">
            <section className="bg-primary-500 h-[8%] flex items-center justify-center relative">
                <button className="absolute left-4 flex items-center p-4 gap-3" onClick={handleBackBtn}>
                    <ChevronLeftIcon className="h-6 text-white" />
                    <span><h1 className="font-bold text-white">Choose an upload method</h1></span>
                </button>
             
            </section>
            <section className="h-[90%] flex items-center">
                <div className="flex flex-col items-center justify-center h-full w-[50%]">
                    <h1 className="text-md">Please connect and send files to bluetooth name</h1>
                    <h1 className="text-xl font-bold text-primary-500">{settings?.btName}</h1>
                    <div>
                        <button
                            className="rounded-full py-2 px-4 font-bold text-primary-500 bg-primary-50 hover:bg-primary-100 mt-5 flex items-center gap-2"
                            onClick={handleReloadBTServer}
                        >
                            Pick a sent file<span><FolderOpenIcon className="h-5" /></span>
                        </button>
                        {selectedFile && (
                            <button
                                className="rounded-full py-2 px-4 font-bold text-primary-500 bg-primary-50 hover:bg-primary-100 mt-5 flex items-center gap-2"
                                onClick={handlePrintBtn}
                            >
                                Print<span><PrinterIcon className="h-5" /></span>
                            </button>
                        )}
                    </div>
                </div>
                <div className="w-[50%] p-5">
                    <DocumentView file={selectedFile} onLoad={() => { }} />
                </div>
            </section>        
            

        </main>
    );
}

export default BluetoothUpload;
