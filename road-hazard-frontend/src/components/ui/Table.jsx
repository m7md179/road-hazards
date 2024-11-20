export const Table = ({ children, className = "", ...props }) => {
    return (
      <div className="overflow-x-auto">
        <table 
          className={`min-w-full divide-y divide-gray-200 ${className}`}
          {...props}
        >
          {children}
        </table>
      </div>
    );
  };
  
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