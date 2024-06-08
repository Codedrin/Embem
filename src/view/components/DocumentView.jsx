import { useEffect, useState, useRef } from 'react';
import { Document, Page } from 'react-pdf';
import DocumentControls from './DocumentControls';
import LoadingSVG from "../../assets/Spin-1s-200px.svg";
import { renderAsync } from 'docx-preview';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

const DocumentView = ({ file, fileType, onLoad }) => {
    const [currPage, setCurrPage] = useState(1);
    const [numPages, setNumPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const viewerRef = useRef(null);

    console.log("Received file: ", file); // Debugging line
    console.log("Received fileType: ", fileType); // Debugging line

    const onLoadSuccess = (doc) => {
        const { numPages } = doc;
        setNumPages(numPages);
        onLoad(doc);
    };

    const handleNextPage = () => {
        if (currPage < numPages) {
            setCurrPage((prev) => prev + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currPage > 1) {
            setCurrPage((prev) => prev - 1);
        }
    };

    const Loading = () => {
        useEffect(() => {
            setIsLoading(true);
            return () => {
                setIsLoading(false);
            };
        }, []);

        return <img src={LoadingSVG} className='w-20' alt="Loading" />;
    };

    useEffect(() => {
        if (fileType === "docx" && file) {
            const fetchDocx = async () => {
                try {
                    const response = await fetch(file);
                    const arrayBuffer = await response.arrayBuffer();
                    await renderAsync(arrayBuffer, viewerRef.current, undefined, { inWrapper: false });
                } catch (error) {
                    console.error('Error rendering DOCX file:', error);
                }
            };

            fetchDocx();
        }
    }, [file, fileType]);

    if (fileType === "pdf") {
        return (
            <div className='flex flex-col items-center'>
                <Document 
                    file={file}
                    className='w-fit h-fit shadow-md '
                    loading={<Loading />}
                    onLoadSuccess={onLoadSuccess}
                >
                    <Page pageNumber={currPage}/>
                </Document>
                <DocumentControls 
                    currentPage={currPage}
                    pages={numPages}
                    onNextPage={handleNextPage}
                    onPreviousPage={handlePreviousPage}
                />
            </div>
        );
    } else if (fileType === "docx") {
        return <div ref={viewerRef} className="docx-viewer"></div>;
    } else {
        return <div>Unsupported file type</div>;
    }
};

export default DocumentView;
