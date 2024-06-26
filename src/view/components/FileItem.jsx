import React from 'react';
import FI_PDF from '../../assets/FI_PDF.png';
import { useNavigate } from 'react-router-dom';

const FileItem = ({ file }) => {
    const navigate = useNavigate();

    const onClick = () => {
        if (file && file.url && file.fileName) {
            navigate("/view", {
                state: {
                    file_url: file.url,
                    file_name: file.fileName
                }
            });
        }
    };

    const getFileIcon = () => {
        if (file && file.fileName && file.fileName.endsWith('.pdf')) {
            return FI_PDF;
        } else {
            // Add default icon or handle other file types
            return null;
        }
    };

    if (!file || !file.fileName) {
        return null; // or a placeholder component if necessary
    }

    return (
        <button
            className="flex flex-col w-fit h-fit justify-center items-center p-2 space-y-1 cursor-pointer overflow-y-visible"
            onClick={onClick}
        >
            <img src={getFileIcon()} className="h-16" alt="File Icon" />
            <h1 className="text-center text-sm truncate w-24 text-primary-500 font-bold">{file.fileName}</h1>
        </button>
    );
};

export default FileItem;
