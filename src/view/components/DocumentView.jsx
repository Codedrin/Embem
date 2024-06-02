import { useEffect, useState } from 'react'
import { Document, Page } from 'react-pdf'

import DocumentControls from './DocumentControls'
import LoadingSVG from "../../assets/Spin-1s-200px.svg"

import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'

const DocumentView = ({ file, onLoad }) => {

    const [currPage, setCurrPage] = useState(1)
    const [numPages, setNumPages] = useState(1)
    const [isLoading, setIsLoading] = useState(true)

    const onLoadSuccess = (doc) => {
        const { numPages } = doc

        console.log("PDF loaded successfully")

        setNumPages(numPages)
        onLoad(doc)
    }

    const handleNextPage = () => {
        if(currPage < numPages) {
            setCurrPage(prev => prev + 1)
        }
    }

    const handlePreviousPage = () => {
        if(currPage > 1) {
            setCurrPage(prev => prev - 1)
        }
    }

    const Loading = () => {

        useEffect(() => {
            setIsLoading(true)

            return () => {
                setIsLoading(false)
            }
        }, [])

        return (
            <img src={LoadingSVG} className='w-20' />
        )
    }

    if(file) {
        return (
            <div className='flex flex-col items-center'>
                <Document 
                    file={file}
                    className='w-fit h-fit shadow-md '
                    loading={<Loading />}
                    onLoadSuccess={onLoadSuccess}>
                    <Page pageNumber={currPage}/>
                </Document>
                <DocumentControls 
                    currentPage={currPage}
                    pages={numPages}
                    onNextPage={handleNextPage}
                    onPreviousPage={handlePreviousPage}/>
            </div>
        )
    }else{
        return (
            <div></div>
        )
    }
}

export default DocumentView