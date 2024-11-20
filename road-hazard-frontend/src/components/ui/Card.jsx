export const Card = ({ children, className = "", ...props }) => {
    return (
      <div 
        className={`bg-white rounded-lg shadow-md ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  };
  
  export const CardHeader = ({ children, className = "", ...props }) => {
    return (
      <div 
        className={`p-4 border-b ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  };
  
  export const CardTitle = ({ children, className = "", ...props }) => {
    return (
      <h3 
        className={`text-lg font-semibold text-gray-800 ${className}`}
        {...props}
      >
        {children}
      </h3>
    );
  };
  
  export const CardContent = ({ children, className = "", ...props }) => {
    return (
      <div 
        className={`p-4 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  };