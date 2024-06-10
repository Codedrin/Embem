import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PrinterIcon, ChevronLeftIcon } from '@heroicons/react/24/solid';
import DocumentView from '../components/DocumentView';
import {
    ALL_PAGES,
    SPECIFIC_ONLY,
    COLORED,
    GRAYSCALE,
    FILE_RETRIEVE_SUCCESS_MESSAGE,
    FILE_RETRIEVE_ERROR_MESSAGE,
    FILE_NOT_FOUND_ERROR_MESSAGE,
    PRINT_ERROR_SPECIFIC_PAGES,
    PRINT_ERROR_NUM_COPIES
} from '../../utils/constants';
import LOGO from '../../assets/logo.png';
import FIREBASE_LOGO from '../../assets/images/firebase-logo.png';

const DocumentViewer = () => {
    const [printMethod, setPrintMethod] = useState(ALL_PAGES);
    const [printStyle, setPrintStyle] = useState(COLORED);
    const [file, setFile] = useState(null);
    const [fileType, setFileType] = useState('');
    const [maxPages, setMaxPages] = useState(-1);
    const [fromPages, setFromPages] = useState(1);
    const [toPages, setToPages] = useState(1);
    const [copies, setCopies] = useState(1);    
    const [name, setName] = useState('');

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const { bt_file, file_url, file_name } = location.state;

        if (bt_file) {
            setFile(bt_file);
            setName(file_name);
            setFileType(file_name.split('.').pop().toLowerCase());
            toast.success(FILE_RETRIEVE_SUCCESS_MESSAGE);
        } else if (file_url) {
            setFile(file_url);
            setName(file_name);
            setFileType(file_name.split('.').pop().toLowerCase());
            toast.success(FILE_RETRIEVE_SUCCESS_MESSAGE);
        } else {
            toast.error(FILE_NOT_FOUND_ERROR_MESSAGE);
        }
    }, [location.state]);

    const handleOnLoadDocument = (doc) => {
        const { numPages } = doc;
        setFromPages(1);
        setToPages(numPages);
        setMaxPages(numPages);
    };

    const handleChangePrintMethod = (e) => {
        setPrintMethod(e.target.value);
    };

    const handleChangePrintStyle = (e) => {
        setPrintStyle(e.target.value);
    };
    const handleProceedButton = e => {
        try{
            e.preventDefault()

            let modFromPages = -1
            let modToPages = -1

            if(printMethod == SPECIFIC_ONLY) {
                if(fromPages > maxPages || toPages > maxPages) {
                    throw new Error(PRINT_ERROR_SPECIFIC_PAGES)
                }

                modFromPages = fromPages
                modToPages = toPages
            }else{
                modFromPages = 1
                modToPages = maxPages
            }

            if(copies < 1 || copies > 100) {
                throw new Error(PRINT_ERROR_NUM_COPIES)
            }

            navigate("/print", {
                state:{
                    file,
                    name,
                    numPages: maxPages,
                    fromPages: modFromPages,
                    toPages: modToPages,
                    copies,
                    printStyle,
                    printMethod
                }
            })
        }catch(error){
            console.log(error)
            toast.error(error)
        }
    }

    const handleBackBtn = () => {
        navigate(-1);
    };

    return (
        <main className="w-full h-full">
            <section className="bg-primary-500 h-16 flex items-center justify-center relative">
                <button className="absolute left-4 flex items-center p-4 gap-3" onClick={handleBackBtn}>
                    <ChevronLeftIcon className="h-6 text-white" />
                    <span><h1 className="font-bold text-white">Go back</h1></span>
                </button>
            </section>
            <section className="h-[80%] flex flex-col lg:flex-row overflow-auto">
                <div className="lg:w-1/2 p-2 overflow-auto">
                    <DocumentView 
                        file={file}
                        fileType={fileType}
                        onLoad={handleOnLoadDocument} />
                </div>
                <div className="lg:w-1/2 flex justify-center items-center p-4">
                    <form className="w-full max-w-md">
                        <div className="my-5">
                            <h5 className="font-bold text-sm mb-1 text-gray-900">File Name</h5>
                            <input
                                className="border px-3 py-2 rounded-md text-sm w-full" 
                                type="text" disabled placeholder={name} value={name} />
                        </div>
                        <div className="my-5">
                            <h5 className="font-bold text-sm mb-1 text-gray-900">Total Pages</h5>
                            <input
                                className="border px-3 py-2 rounded-md text-sm w-full" 
                                type="text" disabled placeholder="10 pages" value={maxPages} />
                        </div>
                        <div>
                            <h5 className="text-sm font-bold mb-1">Pages</h5>
                            <p className="text-sm text-gray-400">Select if you want to print specific pages or all.</p>
                        </div>
                        <div className="ml-5 flex flex-col gap-1 mt-2">
                            <div className="flex items-center gap-2">
                                <input type="radio" name="pages-options" checked={printMethod === ALL_PAGES} onChange={handleChangePrintMethod} value={ALL_PAGES} className="text-primary-500"/>
                                <h5 className="text-sm font-semibold">All pages</h5>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="radio" name="pages-options" checked={printMethod === SPECIFIC_ONLY} onChange={handleChangePrintMethod} value={SPECIFIC_ONLY} className="text-primary-500"/>
                                <h5 className="text-sm font-semibold">Specific pages only</h5>
                            </div>
                            <div className="flex flex-row gap-3 ml-6 mt-2">
                                <div className="">
                                    <h5 className="font-bold text-sm mb-1 text-gray-900">From pages</h5>
                                    <input
                                        className="border px-3 py-2 rounded-md text-sm focus:outline-primary-500 w-full"  
                                        type="number" disabled={printMethod !== SPECIFIC_ONLY} value={fromPages}
                                        max={maxPages} min={1} onChange={(e) => setFromPages(e.target.value)} />
                                </div>
                                <div className="">
                                    <h5 className="font-bold text-sm mb-1 text-gray-900">To page</h5>
                                    <input
                                        className="border px-3 py-2 rounded-md text-sm focus:outline-primary-500 w-full" 
                                        type="number" disabled={printMethod !== SPECIFIC_ONLY} value={toPages}
                                        max={maxPages} min={1} onChange={(e) => setToPages(e.target.value)} />
                                </div>
                            </div>
                        </div>
                        <div className="mt-5">
                            <h5 className="text-sm font-bold mb-1">Print options</h5>
                            <p className="text-sm text-gray-400">Choose if you want colored or grayscale.</p>
                        </div>
                        <div className="ml-5 flex flex-col gap-1 mt-2">
                            <div className="flex gap-2">
                                <input type="radio" name="print-options" checked={printStyle === COLORED} className="text-primary-500" onChange={handleChangePrintStyle} value={COLORED}/>
                                <div>
                                    <h5 className="text-sm font-semibold">Colored</h5>
                                    <p className="text-xs text-gray-400">Proceed with printing it with color.</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <input type="radio" name="print-options" checked={printStyle === GRAYSCALE} className="text-primary-500" onChange={handleChangePrintStyle} value={GRAYSCALE}/>
                                <div>
                                    <h5 className="text-sm font-semibold">Grayscale</h5>
                                    <p className="text-xs text-gray-400">Proceed with printing in black and white.</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-5">
                            <h5 className="text-sm font-bold mb-1">Number of copies</h5>
                            <p className="text-sm text-gray-400">How many should I print?</p>
                            <input
                                className="border px-3 py-2 rounded-md text-sm focus:outline-primary-500 w-full mt-2" 
                                type="number" value={copies} onChange={e => setCopies(e.target.value)} max={99} min={1} />
                        </div>
                        <div className="mt-5">
                            <button className="mt-2 bg-secondary-50 px-4 py-1 hover:bg-secondary-100 border rounded text-sm font-semibold text-secondary-700 flex items-center gap-2 w-full justify-center" onClick={handleProceedButton}>Proceed</button>
                        </div>
                    </form>
                </div>
            </section>
            <section className="h-24 bg-primary-500 flex items-center justify-center">
                <div className="mt-5">
                    <p className="text-sm text-gray-300">Powered by</p>
                    <ul className="flex gap-2 justify-center">
                        <li><img src={LOGO} className="h-10 grayscale" alt="Logo" /></li>
                        <li><img src={FIREBASE_LOGO} className="h-10 grayscale" alt="Firebase Logo" /></li>
                    </ul>
                </div>
            </section>
        </main>
    );
};

export default DocumentViewer;
