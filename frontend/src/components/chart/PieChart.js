import React from 'react';
import { BarChart, Bar, XAxis, YAxis, 
    CartesianGrid, LineChart, Tooltip, Line, PieChart, Pie, Cell, Legend,ResponsiveContainer  } from 'recharts';
  
const PieChartToken = () => {
  
    const data = [
        { name: '2001', x: 12, y: 93, z: 122 },
        { name: 'B', x: 22, y: 3, z: 73 },
        { name: 'C', x: 13, y: 15, z: 32 },
        { name: 'D', x: 44, y: 35, z: 23 },
        { name: 'E', x: 35, y: 45, z: 20 },
        { name: 'F', x: 62, y: 25, z: 29 },
        { name: 'G', x: 37, y: 17, z: 61 },
        { name: 'H', x: 28, y: 32, z: 45 },
        { name: 'I', x: 19, y: 43, z: 93 },
    ];

    const data1 = [
      { name: 'Partner', value: 9 },
      { name: 'supply', value: 51 },
      { name: 'Minipools', value: 39 },
      { name: 'Team', value: 1 },

    ];

    const COLORS = ['#00B050', '#385723', '#A5A5A5', '#FFC000','#00FF00'];

    const  RADIAN = Math.PI / 180;

    const renderCustomizedLabel = ({
      cx, cy, midAngle, innerRadius, outerRadius, percent, index,
    }) => {
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);

      return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      );
    }

  
    return (
        <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>

        <PieChart>
				<Pie
					data={data1}
          cx="50%"
          cy="50%"
                    labelLine={false}
                    xlinkTitle="dfas"
					label={renderCustomizedLabel}
					outerRadius={90}
					fill="#8884d8"
					dataKey="value"
                    >
					{
                        data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
					}
				</Pie>
                <Legend  />
			    </PieChart>
            </ResponsiveContainer>
            <div className="text-center">
            <button className="custom-btn secondary-btn">GO TO STAKE</button>
            </div>

        </div>
    );
}
  
export default PieChartToken;