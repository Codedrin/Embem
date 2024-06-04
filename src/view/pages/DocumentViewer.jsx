import { toast } from "react-toastify"
import { downloadFile } from "../../controller/DropboxAPI"
import DocumentView from "../components/DocumentView"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { PrinterIcon, ChevronLeftIcon } from "@heroicons/react/24/solid"
import { useNavigate } from "react-router-dom"

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
} from "../../utils/constants"

const DocumentViewer = () => {

    const [printMethod, setPrintMethod] = useState(ALL_PAGES)
    const [printStyle, setPrintStyle] = useState(COLORED)
    const [file, setFile] = useState(null)
    const [maxPages, setMaxPages] = useState(-1)
    const [fromPages, setFromPages] = useState(1)
    const [toPages, setToPages] = useState(1)
    const [copies, setCopies] = useState(1)
    const [name, setName] = useState('')

    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        try{
            const { bt_file, file_name, file_path } = location.state

            // Direct file from Bluetooth
            if(bt_file) {
                setFile(bt_file)
                setName(file_name)
            }else{
                if(file_path == null) {
                    throw new Error(FILE_NOT_FOUND_ERROR_MESSAGE)
                }
    
                (async () => {
                    try{
                        const downloadedFile = await downloadFile(file_path)
                        if(downloadedFile != null) {
                            setFile(downloadedFile)
                            setName(file_name)
                            toast.success(FILE_RETRIEVE_SUCCESS_MESSAGE)
                        }else{
                            throw new Error(FILE_RETRIEVE_ERROR_MESSAGE)
                        }
                    }catch(error) {
                        console.log(error)
                        toast.error(error)
                    }
                })()
            }

        }catch(error){
            console.error(error)
            toast.error(error)
        }
    }, [])

    const handleOnLoadDocument = (doc) => {
        const { numPages } = doc

        console.log(doc)

        setFromPages(1)
        setToPages(numPages)
        setMaxPages(numPages)
    }

    const handleChangePrintMethod = e => {
        setPrintMethod(e.target.value)
    }

    const handleChangePrintStyle = e => {
        setPrintStyle(e.target.value)
    }

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

    const handleBackBtn = e => {
        navigate(-1)
    }

    return (
        <main className="w-[100%] h-[100vh]">
            <section className="h-[5%] bg-primary-500 flex items-center">
                <button className="flex items-center p-4 gap-3" onClick={handleBackBtn}>
                        <ChevronLeftIcon className="h-6 text-white" />
                        <span><h1 className="font-bold text-white">Choose another file</h1></span>
                </button>
            </section>
            <section className="h-[90%] flex overflow-auto">
                <div className="w-[50%] p-2 overflow-auto">
                    <DocumentView 
                        file={file}
                        onLoad={handleOnLoadDocument} />
                </div>
                <div className="w-[50%] flex justify-center items-center">
                    <form>
                        <div className="my-5">
                            <h5 className="font-bold text-sm mb-1 text-gray-900">File Name</h5>
                            <input
                                className="border px-3 py-2 rounded-md text-sm" 
                                type="text" disabled placeholder="test-file.pdf" value={name} />
                        </div>
                        <div className="my-5">
                            <h5 className="font-bold text-sm mb-1 text-gray-900">Total Pages</h5>
                            <input
                                className="border px-3 py-2 rounded-md text-sm" 
                                type="text" disabled placeholder="10 pages" value={maxPages} />
                        </div>
                        <div>
                            <h5 className="text-sm font-bold mb-1">Pages</h5>
                            <p className="text-sm text-gray-400">Select if you want to print specific pages or all.</p>
                        </div>
                        <div className="ml-5 flex flex-col gap-1 mt-2">
                            <div className="flex items-center gap-2">
                                <input type="radio" name="pages-options" id="" checked={printMethod==ALL_PAGES} onChange={handleChangePrintMethod} value={ALL_PAGES} className="text-primary-500"/>
                                <h5 className="text-sm font-semibold">All pages</h5>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="radio" name="pages-options" id="" checked={printMethod==SPECIFIC_ONLY} onChange={handleChangePrintMethod} value={SPECIFIC_ONLY} className="text-primary-500"/>
                                <h5 className="text-sm font-semibold">Specific pages only</h5>
                            </div>
                            <div className="flex flex-row gap-3 ml-6 mt-2">
                                <div className="">
                                    <h5 className="font-bold text-sm mb-1 text-gray-900">From pages</h5>
                                    <input
                                        className="border px-3 py-2 rounded-md text-sm focus:outline-primary-500 w-24"  
                                        type="number" disabled={printMethod != SPECIFIC_ONLY} value={fromPages}
                                        max={maxPages} min={1} onChange={(e) => setFromPages(e.target.value)} />
                                </div>
                                <div className="">
                                    <h5 className="font-bold text-sm mb-1 text-gray-900">To page</h5>
                                    <input
                                        className="border px-3 py-2 rounded-md text-sm focus:outline-primary-500 w-24" 
                                        type="number" disabled={printMethod != SPECIFIC_ONLY} value={toPages}
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
                                <input type="radio" name="print-options" id="" checked={printStyle == COLORED} className="text-primary-500" onChange={handleChangePrintStyle} value={COLORED}/>
                                <div>
                                    <h5 className="text-sm font-semibold">Colored</h5>
                                    <p className="text-xs text-gray-400">Proceed with printing it with color.</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <input type="radio" name="print-options" id="" checked={printStyle == GRAYSCALE} className="text-primary-500" onChange={handleChangePrintStyle} value={GRAYSCALE}/>
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
                                className="border px-3 py-2 rounded-md text-sm focus:outline-primary-500 w-24 mt-2" 
                                type="number" value={copies} onChange={e => setCopies(e.target.value)} max={99} min={1} />
                        </div>
                        <div className="mt-5">
                            <button className="mt-2 bg-secondary-50 px-4 py-1 hover:bg-secondary-100 border rounded text-sm font-semibold text-secondary-700 flex items-center gap-2" onClick={handleProceedButton}>Proceed</button>
                        </div>
                    </form>
                </div>
            </section>
            <section className="h-[5%] bg-primary-500"></section>
        </main>
    )
}

export default DocumentViewer