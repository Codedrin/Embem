import FileItem from "./FileItem"

const FileContainer = ({ files }) => {

    return (
        <div className="h-80 w-[100%] p-2 border-primary-500 border-2 rounded-lg overflow-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {
                files.map((file, _) => <FileItem key={file.file_name} file={file} />)
            }
        </div>
    )
}

export default FileContainer