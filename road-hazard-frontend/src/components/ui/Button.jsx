const Button = ({ 
    children, 
    variant = "primary", 
    size = "md", 
    className = "",
    ...props 
  }) => {
    const baseClasses = "btn";
    
    const variants = {
      primary: "btn-primary",
      secondary: "btn-secondary",
      ghost: "hover:bg-gray-100 text-gray-700",
      danger: "bg-red-600 text-white hover:bg-red-700"
    };
  
    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4",
      lg: "h-12 px-6 text-lg"
    };
  
    const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
    return (
      <button className={classes} {...props}>
        {children}
      </button>
    );
  };
  
  export default Button;