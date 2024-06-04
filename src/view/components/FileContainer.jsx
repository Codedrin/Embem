import React from 'react';
import FileItem from './FileItem';

const FileContainer = ({ files, onFileClick }) => {
    return (
        <div className="h-80 w-full p-2 border-primary-500 border-2 rounded-lg overflow-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.length > 0 ? (
                files.map(file => (
                    <FileItem key={file.key} file={file} onClick={onFileClick} />
                ))
            ) : (
                <p className="text-center">No files available</p>
            )}
        </div>
    );
};

export default FileContainer;
