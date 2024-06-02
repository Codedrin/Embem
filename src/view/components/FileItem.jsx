import { useEffect } from "react"
import FI_PDF from "../../assets/FI_PDF.png"
import { downloadFile } from "../../controller/DropboxAPI"
import { useNavigate } from "react-router-dom"

const FileItem = ({file, disabled}) => {

    const navigate = useNavigate()

    const onclick = () => {
        navigate("/view", {
            state: {
                file_path: file.file_path,
                file_name: file.file_name
            }
        })
    }

    return (
        <button 
            className="flex flex-col w-fit h-fit justify-center items-center p-2 space-y-1 cursor-pointer overflow-y-visible" 
            onClick={onclick} 
            disabled={disabled}>
            <img src={FI_PDF} className="h-16" />
            <h1 className="text-center text-sm truncate w-24 text-primary-500 font-bold">
                {file.file_name}
            </h1>
        </button>
    )
}

export default FileItem