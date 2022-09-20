import React from 'react';
import { BarChart, Bar, XAxis, YAxis, 
    CartesianGrid, LineChart, Tooltip, Line, PieChart, Pie,ResponsiveContainer } from 'recharts';
// import {newPlot} from "plotly.js"
  
const HistoricGraph = ({data}) => {
    console.log("HistoricGraph",data)
    
    const data1 = [
        { name: '2001', x: 12, y: 93, z: 122 },
        { name: '2002', x: 22, y: 3, z: 73 },
        { name: '2004', x: 13, y: 15, z: 32 },
        { name: '2006', x: 44, y: 35, z: 23 },
        { name: '2007', x: 35, y: 45, z: 20 },
        { name: '2008', x: 62, y: 25, z: 29 },
        { name: '2009', x: 37, y: 17, z: 61 },
    ];

    return (
        <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
          <BarChart  data={data}  style={{marginBottom:'1rem',paddingTop:"2rem", paddingBottom:"20px"}}>
            <CartesianGrid />
            <XAxis dataKey="name" />
            <YAxis />
            <Bar dataKey="x" stackId="a" fill="#366ad9"  />
            <Bar dataKey="y" stackId="a" fill="#eba226" />
        </BarChart>
        </ResponsiveContainer>

        </div>
    );
}
  
export default HistoricGraph;