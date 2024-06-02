import { useEffect, useState } from "react"
import DocumentView from "../components/DocumentView"
import { ChevronLeftIcon, PrinterIcon } from "@heroicons/react/24/solid"
import { useLocation, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

import { ALL_PAGES, SPECIFIC_ONLY, COLORED, GRAYSCALE } from "../../utils/constants"

const PrintProcessPage = () => {

    const [file, setFile] = useState(null)
    const [printerName, setPrinterName] = useState("PRINTER 1")
    const [name, setName] = useState(null)
    const [numPages, setNumPages] = useState(null)
    const [fromPages, setFromPages] = useState(null)
    const [toPages, setToPages] = useState(null)
    const [copies, setCopies] = useState(1)
    const [printStyle, setPrintStyle] = useState(null)
    const [printMethod, setPrintMethod] = useState(null)

    const [toPay, setToPay] = useState(0.00)
    const [coins, setCoins] = useState(0.00)

    const location = useLocation()
    const navigate = useNavigate()

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
        } = location.state

        setFile(file)
        setName(name)
        setNumPages(numPages)
        setFromPages(fromPages)
        setToPages(toPages)
        setCopies(copies)
        setPrintStyle(printStyle)
        setPrintMethod(printMethod)
    }, [])

    useEffect(() => {
        if(file){
            calculatePrint()
        }
    }, [file])

    const handleBackBtn = () => {
        navigate(-1)
    }

    const calculatePrint = () => {
        let pricePerPage = -1
        if(printStyle == COLORED) {
            pricePerPage = 10
        }else if(printStyle == GRAYSCALE){
            pricePerPage = 5
        }

        let totalPages = (toPages - fromPages) + 1
        let totalCopies = totalPages * copies
        let toPay = totalCopies * pricePerPage

        setToPay(toPay)
    }

    const handlePrintDocument = (e) => {
        e.preventDefault()

        if(coins < toPay) {
            toast.error("Please insert the right amount before printing.")
        }else{
            toast.success("Thank you for printing with us.")
            navigate("/upload-method")
        }
    }

    return (
        <main className="w-[100%] h-[100vh]">
            <section className="h-[5%] bg-primary-500 flex items-center">
                <button className="flex items-center p-4 gap-3" onClick={handleBackBtn}>
                        <ChevronLeftIcon className="h-6 text-white" />
                        <span><h1 className="font-bold text-white">Review your print session again.</h1></span>
                </button>
            </section>
            <section className="h-[90%] flex overflow-auto">
                <div className="w-[50%] p-2 overflow-auto">
                    <DocumentView 
                        file={file}
                        onLoad={() => {}} />
                </div>
                    <div className="w-[50%] flex justify-center items-center">
                        <form>
                            <div className="my-5">
                                <h5 className="font-bold text-sm mb-1 text-gray-900 flex items-center gap-2">Printer Name<span><PrinterIcon className="h-4" /></span></h5>
                                <input
                                    className="border px-3 py-2 rounded-md text-sm" 
                                    type="text" disabled value={printerName} />
                            </div>
                            <div className="flex gap-3">
                                <div className="my-5">
                                    <h5 className="font-bold text-sm mb-1 text-gray-900 flex items-center gap-2">File Name</h5>
                                    <input
                                        className="border px-3 py-2 rounded-md text-sm" 
                                        type="text" disabled value={name} />
                                </div>
                                <div className="my-5">
                                    <h5 className="font-bold text-sm mb-1 text-gray-900 flex items-center gap-2">Pages to Print</h5>
                                    <input
                                        className="border px-3 py-2 rounded-md text-sm" 
                                        type="text" disabled value={printMethod == ALL_PAGES ? `All pages (${numPages}).` : `From page ${fromPages} to ${toPages}.`} />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="">
                                    <h5 className="font-bold text-sm mb-1 text-gray-900 flex items-center gap-2">Copies</h5>
                                    <input
                                        className="border px-3 py-2 rounded-md text-sm" 
                                        type="text" disabled value={copies} />
                                </div>
                                <div className="">
                                    <h5 className="font-bold text-sm mb-1 text-gray-900 flex items-center gap-2">Output</h5>
                                    <input
                                        className="border px-3 py-2 rounded-md text-sm capitalize" 
                                        type="text" disabled placeholder="Printer" value={printStyle} />
                                </div>
                            </div>
                            <div className="flex gap-3 my-5">
                                <div className="">
                                    <h5 className="font-bold text-sm mb-1 text-gray-900 flex items-center gap-2">To Pay</h5>
                                    <input
                                        className="border px-3 py-2 rounded-md text-sm" 
                                        type="text" disabled value={`Php ${toPay}`} />
                                </div>
                                <div className="">
                                    <h5 className="font-bold text-sm mb-1 text-gray-900 flex items-center gap-2">Insert Coins</h5>
                                    <input
                                        className="border px-3 py-2 rounded-md text-sm capitalize" 
                                        type="text" disabled placeholder="Printer" value={`Php ${coins}`} />
                                </div>
                            </div>
                            <div className="mt-5">
                                <button className="mt-2 bg-secondary-50 px-4 py-1 hover:bg-secondary-100 border rounded text-sm font-semibold text-secondary-700 flex items-center gap-2" onClick={handlePrintDocument}>Print <span><PrinterIcon className="h-4" /></span></button>
                            </div>
                        </form>
                    </div>
            </section>
            <section className="h-[5%] bg-primary-500">
            </section>
        </main>
    )
}

export default PrintProcessPage