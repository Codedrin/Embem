import { useEffect, useState } from "react";
import DocumentView from "../components/DocumentView";
import { ChevronLeftIcon, PrinterIcon } from "@heroicons/react/24/solid";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LOGO from '../../assets/logo.png';
import DROPBOX_LOGO from '../../assets/images/dropbox-logo.png';
import FIREBASE_LOGO from '../../assets/images/firebase-logo.png';
import { ALL_PAGES, SPECIFIC_ONLY, COLORED, GRAYSCALE } from "../../utils/constants";

const PrintProcessPage = () => {
    const [file, setFile] = useState("");
    const [fileType, setFileType] = useState("");
    const [printerName, setPrinterName] = useState("PRINTER 1");
    const [name, setName] = useState("");
    const [numPages, setNumPages] = useState(0);
    const [fromPages, setFromPages] = useState(1);
    const [toPages, setToPages] = useState(1);
    const [copies, setCopies] = useState(1);
    const [printStyle, setPrintStyle] = useState(COLORED);
    const [printMethod, setPrintMethod] = useState(ALL_PAGES);
    const [toPay, setToPay] = useState(0.00);
    const [coins, setCoins] = useState(0.00);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const {
            file,
            name,
            numPages,
            fromPages,
            toPages,
            copies,
            printStyle,
            printMethod
        } = location.state || {};

        setFile(file || "");
        setName(name || "");
        setNumPages(numPages || 0);
        setFromPages(fromPages || 1);
        setToPages(toPages || 1);
        setCopies(copies || 1);
        setPrintStyle(printStyle || COLORED);
        setPrintMethod(printMethod || ALL_PAGES);

        // Determine file type based on file extension, ignoring query parameters
        const fileType = file ? file.split('.').pop().split('?')[0].toLowerCase() : "";
        console.log("File Type: ", fileType); // Debugging line
        setFileType(fileType);
    }, [location.state]);

    useEffect(() => {
        if (file) {
            calculatePrint();
        }
    }, [file]);

    const handleBackBtn = () => {
        navigate(-1);
    };

    const calculatePrint = () => {
        let pricePerPage = -1;
        if (printStyle === COLORED) {
            pricePerPage = 10;
        } else if (printStyle === GRAYSCALE) {
            pricePerPage = 5;
        }

        let totalPages = (toPages - fromPages) + 1;
        let totalCopies = totalPages * copies;
        let toPay = totalCopies * pricePerPage;

        setToPay(toPay);
    };

    const handlePrintDocument = (e) => {
        e.preventDefault();

        if (coins < toPay) {
            toast.error("Please insert the right amount before printing.");
        } else {
            toast.success("Thank you for printing with us.");
            navigate("/upload-method");
        }
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
                        onLoad={() => {}} />
                </div>
                <div className="lg:w-1/2 flex justify-center items-center p-4">
                    <form className="w-full max-w-md">
                        <div className="my-5">
                            <h5 className="font-bold text-sm mb-1 text-gray-900 flex items-center gap-2">Printer Name<span><PrinterIcon className="h-4" /></span></h5>
                            <input
                                className="border px-3 py-2 rounded-md text-sm w-full" 
                                type="text" disabled value={printerName} />
                        </div>
                        <div className="flex flex-col lg:flex-row gap-3">
                            <div className="my-5 w-full">
                                <h5 className="font-bold text-sm mb-1 text-gray-900 flex items-center gap-2">File Name</h5>
                                <input
                                    className="border px-3 py-2 rounded-md text-sm w-full" 
                                    type="text" disabled value={name} />
                            </div>
                            <div className="my-5 w-full">
                                <h5 className="font-bold text-sm mb-1 text-gray-900 flex items-center gap-2">Pages to Print</h5>
                                <input
                                    className="border px-3 py-2 rounded-md text-sm w-full" 
                                    type="text" disabled value={printMethod === ALL_PAGES ? `All pages (${numPages}).` : `From page ${fromPages} to ${toPages}.`} />
                            </div>
                        </div>
                        <div className="flex flex-col lg:flex-row gap-3">
                            <div className="w-full">
                                <h5 className="font-bold text-sm mb-1 text-gray-900 flex items-center gap-2">Copies</h5>
                                <input
                                    className="border px-3 py-2 rounded-md text-sm w-full" 
                                    type="text" disabled value={copies} />
                            </div>
                            <div className="w-full">
                                <h5 className="font-bold text-sm mb-1 text-gray-900 flex items-center gap-2">Output</h5>
                                <input
                                    className="border px-3 py-2 rounded-md text-sm w-full capitalize" 
                                    type="text" disabled value={printStyle} />
                            </div>
                        </div>
                        <div className="flex flex-col lg:flex-row gap-3 my-5">
                            <div className="w-full">
                                <h5 className="font-bold text-sm mb-1 text-gray-900 flex items-center gap-2">To Pay</h5>
                                <input
                                    className="border px-3 py-2 rounded-md text-sm w-full" 
                                    type="text" disabled value={`Php ${toPay}`} />
                            </div>
                            <div className="w-full">
                                <h5 className="font-bold text-sm mb-1 text-gray-900 flex items-center gap-2">Insert Coins</h5>
                                <input
                                    className="border px-3 py-2 rounded-md text-sm w-full" 
                                    type="text" disabled value={`Php ${coins}`} />
                            </div>
                        </div>
                        <div className="mt-5">
                            <button className="mt-2 bg-secondary-50 px-4 py-1 hover:bg-secondary-100 border rounded text-sm font-semibold text-secondary-700 flex items-center gap-2 w-full justify-center" onClick={handlePrintDocument}>Print <span><PrinterIcon className="h-4" /></span></button>
                        </div>
                    </form>
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
};

export default PrintProcessPage;
