import React from "react";

const StatCard = ({ title, value, icon, className = "" }) => {
  return (
    <div className={`p-6 rounded-lg shadow-sm ${className}`}>
      <div className="flex items-center">
        <div className="text-3xl mr-4">{icon}</div>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
