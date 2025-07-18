import React from 'react';

const DonutChart = ({ data }) => {
  const total = data.reduce((acc, item) => acc + item.value, 0);
  let currentAngle = 0;
  
  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {data.map((item, index) => {
          const angle = (item.value / total) * 360;
          const startAngle = currentAngle;
          currentAngle += angle;
          const endAngle = currentAngle;
          
          // Convert angles to radians for calculation
          const startAngleRad = (startAngle - 90) * (Math.PI / 180);
          const endAngleRad = (endAngle - 90) * (Math.PI / 180);
          
          // Calculate start and end points
          const x1 = 50 + 40 * Math.cos(startAngleRad);
          const y1 = 50 + 40 * Math.sin(startAngleRad);
          const x2 = 50 + 40 * Math.cos(endAngleRad);
          const y2 = 50 + 40 * Math.sin(endAngleRad);
          
          // Determine if the arc should be drawn as a large arc
          const largeArc = angle > 180 ? 1 : 0;
          
          // Create the SVG path for the arc
          const path = `
            M 50 50
            L ${x1} ${y1}
            A 40 40 0 ${largeArc} 1 ${x2} ${y2}
            Z
          `;
          
          return (
            <path
              key={index}
              d={path}
              fill={item.color}
              stroke="#fff"
              strokeWidth="1"
            />
          );
        })}
        {/* Inner circle to create donut */}
        <circle cx="50" cy="50" r="25" fill="white" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-center">
        <div>
          <p className="text-2xl font-bold">{total}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
      </div>
    </div>
  );
};

export default DonutChart;