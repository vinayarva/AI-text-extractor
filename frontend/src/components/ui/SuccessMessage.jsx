import React from 'react';

function SuccessMessage({ fileName }) {
    if (!fileName) return null; // Don't render if no file name
    return (
        <p className="mt-4 text-sm text-green-700 bg-green-100 p-3 rounded-md">
            Successfully processed: <span className="font-semibold">{fileName}</span>
        </p>
    );
}

export default SuccessMessage;