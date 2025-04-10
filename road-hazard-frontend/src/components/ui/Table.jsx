import { useMemo } from 'react';

const Table = ({ columns, data, className = "" }) => {
  const tableData = useMemo(() => data, [data]);
  const tableColumns = useMemo(() => columns, [columns]);

  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y divide-gray-200 ${className}`}>
        <thead className="bg-gray-50">
          <tr>
            {tableColumns.map((column, index) => (
              <th 
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.Header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {tableColumns.map((column, colIndex) => (
                <td
                  key={`${rowIndex}-${colIndex}`}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >
                  {column.Cell ? (
                    column.Cell({ 
                      value: row[column.accessor], 
                      row: { original: row } 
                    })
                  ) : (
                    row[column.accessor]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// For backward compatibility
export const TableHeader = ({ children, className = "", ...props }) => {
  return (
    <thead 
      className={`bg-gray-50 ${className}`}
      {...props}
    >
      {children}
    </thead>
  );
};

export const TableRow = ({ children, className = "", ...props }) => {
  return (
    <tr 
      className={`hover:bg-gray-50 ${className}`}
      {...props}
    >
      {children}
    </tr>
  );
};

export const TableHead = ({ children, className = "", ...props }) => {
  return (
    <th
      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}
      {...props}
    >
      {children}
    </th>
  );
};

export const TableCell = ({ children, className = "", ...props }) => {
  return (
    <td
      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${className}`}
      {...props}
    >
      {children}
    </td>
  );
};

export default Table;