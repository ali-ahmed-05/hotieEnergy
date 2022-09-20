import React from 'react';
import { BarChart, Bar, XAxis, YAxis, 
    CartesianGrid, LineChart, Tooltip, Line, PieChart, Pie,ResponsiveContainer } from 'recharts';
import { memo, useEffect, useState } from "react";
import {staking_addr , hestoken_addr , router_addr} from '../../contract/addresses'

import ABI from '../../contract/Staking.json'
import TokenABI from '../../contract/HESTOKEN.json'
import RouterABI from '../../contract/IUniswapV2Router02.json'

import IERC20Metadata from '../../contract/IERC20Metadata.json'

import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import Web3Modal from 'web3modal'
import apis from "../../services";
import {loadProvider} from '../../utils/provider'

// import {newPlot} from "plotly.js"
  
const InvestmentHistory = (data) => {

    
    console.log("InvestmentHistory",data)

    const {
        connector,
        library,
        account,
        chainId,
        activate,
        deactivate,
        active,
        error
    } = useWeb3React();

    const [chartDATA , setChartData] = useState([])
    const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];

    const dataIN = [
        { name: '2001', x: 8000, y: 8000, z: 8000 },
        { name: '2002', x: 22, y: 3, z: 73 },
        { name: '2004', x: 13, y: 15, z: 32 },
        { name: '2006', x: 44, y: 35, z: 23 },
        { name: '2007', x: 35, y: 45, z: 20 },
        { name: '2008', x: 62, y: 25, z: 29 },
        { name: '2009', x: 37, y: 17, z: 61 },
    ];

    const setValues = (_name , _x , _y , _z)=>{
        return { name: _name, x: _x, y: _y, z: _y }
    }

    const settingData = ()=> {
        try {
            if(data.TotalColumns !== undefined){
                let temp = []
                for (let index = 1; index <= data.TotalColumns; index++) {
                  temp.push(setValues("2000" , 100 ,100 ,1))
                }
            }
        } catch (error) {
            console.log("settingData",error)
        }
    }

    const getDetails = async () =>{
        try {
            if(data.TotalColumns !== undefined){

            let signer = await loadProvider()
            let Tokencontract = new ethers.Contract(hestoken_addr, TokenABI, signer);
            let ERC20Metadata = new ethers.Contract(hestoken_addr, IERC20Metadata, signer);
            let stakingContract = new ethers.Contract(staking_addr, ABI, signer);
            let decimals = await Tokencontract.decimals()
            let temp = []
            let start = 1
            if(data.TotalColumns > 6){
                start = data.TotalColumns - 6
            }
            for (let index = start; index <= data.TotalColumns; index++) {
                let snapshot = await stakingContract.stakeSnapshot(account,index)
                let _x = ethers.utils.formatUnits( snapshot[0].toString() , decimals)
                let timestamp = Number(snapshot[1].toString()) * 1000;
                let date = new Date(timestamp);
                let _month = date.getMonth();
                console.log("snapshot", month)
                console.log("snapshot", timestamp)
                temp.push(setValues( month[_month - 1] , _x ,0 ,0))
            }   
            setChartData(temp)


            }  
        } catch (error) {
            console.log(error)
        }
    }

    

    useEffect(async()=>{
        
        getDetails()
    },[account,data])

  
    return (
        <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <BarChart data={chartDATA}  style={{marginBottom:'1rem',paddingTop:"2rem", paddingBottom:"20px"}}>
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
  
export default InvestmentHistory;