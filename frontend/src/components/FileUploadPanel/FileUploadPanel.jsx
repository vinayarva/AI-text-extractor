import FileUploadPanelHeader from './FileUploadPanelHeader'; 
import FileInput from '../ui/FileInput';                     
import LoadingIndicator from '../ui/LoadingIndicator';
import ErrorMessage from '../ui/ErrorMessage';
import SuccessMessage from '../ui/SuccessMessage';

function FileUploadPanel({ onFileSelect, isLoading, error, fileName }) {
  return (
    <div className="w-full md:w-[40%] lg:w-[35%] md:h-screen flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-300 p-6 md:p-8 bg-white flex-shrink-0">
      <div className="w-full max-w-md text-center">
        <FileUploadPanelHeader />
        <FileInput onChange={onFileSelect} disabled={isLoading} />
        {isLoading && <LoadingIndicator text="Processing PDF..." />}
        <ErrorMessage message={error} />
        {!isLoading && !error && <SuccessMessage fileName={fileName} />}
      </div>
    </div>
  );
}

export default FileUploadPanel;