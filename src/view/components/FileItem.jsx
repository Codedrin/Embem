import React from 'react';
import FI_PDF from '../../assets/FI_PDF.png';
import Word from '../../assets/worrd.jpg';
import { useNavigate } from 'react-router-dom';

const FileItem = ({ file }) => {
    const navigate = useNavigate();

 const onClick = () => {
        navigate("/view", {
            state: {
                file_path: file.file_path,
                file_name: file.file_name
            }
        })
    }
    const getFileIcon = () => {
        if (file.fileName.endsWith('.pdf')) {
            return FI_PDF;
        } else if (file.fileName.endsWith('.docx')) {
            return Word;
        } else {
            // Add default icon or handle other file types
            return null;
        }
    };

    return (
        <button className="flex flex-col w-fit h-fit justify-center items-center p-2 space-y-1 cursor-pointer overflow-y-visible" onClick={onClick}>
            <img src={getFileIcon()} className="h-16" alt="File Icon" />
            <h1 className="text-center text-sm truncate w-24 text-primary-500 font-bold">{file.fileName}</h1>
        </button>
    );
};

export default FileItem;
