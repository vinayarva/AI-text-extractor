import React from 'react';
import { VIEW_MODES } from '../../constants'; 

function JsonDisplay({ jsonData, viewMode }) {
  
  if (!jsonData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 text-center p-4">
          No data yet. Upload a PDF to see its JSON representation.
        </p>
      </div>
    );
  }

 
  if (viewMode === VIEW_MODES.TABLE) {
    return (
      <div className="overflow-x-auto"> {/* Ensures table is scrollable on small screens */}
        <table className="min-w-full text-sm table-auto border border-gray-300 rounded-md">
          <colgroup> {/* Define column widths for better layout control */}
            <col className="w-1/3 sm:w-1/4" />
            <col className="w-2/3 sm:w-3/4" />
          </colgroup>
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left font-semibold text-gray-600 border-b border-r border-gray-300">
                Key
              </th>
              <th className="p-3 text-left font-semibold text-gray-600 border-b border-gray-300">
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(jsonData).map(([key, value]) => (
              <tr
                key={key}
                className="border-b border-gray-300 last:border-b-0 hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="p-3 font-medium text-gray-700 bg-gray-50 border-r border-gray-300 break-words">
                  {key}
                </td>
                <td className="p-3 text-gray-700 break-words">
                  {/* Handle nested objects/arrays by stringifying them for the table view */}
                  {typeof value === "object" && value !== null
                    ? JSON.stringify(value, null, 2)
                    : String(value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Default to 'JSON' view (formerly BEAUTIFY): render JSON as preformatted string
  return (
    <pre className="whitespace-pre-wrap text-sm bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
      {JSON.stringify(jsonData, null, 2)}
    </pre>
  );
}

export default JsonDisplay;
