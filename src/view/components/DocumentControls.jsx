import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/solid";

const IconButton = ({ IconComponent, onclick }) => {
    return (
        <button className="rounded bg-primary-50 hover:bg-primary-100 p-1" onClick={onclick}>
            <IconComponent className="text-primary-700" height={20}/>
        </button>
    );
};

const DocumentControls = ({ currentPage = 1, pages = 1, onNextPage, onPreviousPage }) => {
    return (
        <div className="flex justify-center gap-5 w-100 mt-2 items-center">
            <IconButton IconComponent={ChevronLeftIcon} onclick={onPreviousPage} />
            <p className="text-sm font-semibold">{`Page ${currentPage} of ${pages}`}</p>
            <IconButton IconComponent={ChevronRightIcon} onclick={onNextPage} />
        </div>
    );
};

export default DocumentControls;
