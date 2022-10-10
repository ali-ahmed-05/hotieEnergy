import { Col, Container, Row } from "react-bootstrap";
import HorizontalLogo from '../assets/images/horizontal-logo.png'
import {HistoricGraph,Minipooltable} from '../components/Index';

import { memo, useEffect, useState } from "react";
import apis from "../services";
import moment from "moment";
import countdown from 'moment-countdown';
import { DatePeriodFilter } from "igniteui-react-excel";

import {
    staking_addr,
    hestoken_addr,
    router_addr,
  } from "../contract/addresses";
  
  import ABI from "../contract/Staking.json";
  import TokenABI from "../contract/HESTOKEN.json";
  import RouterABI from "../contract/IUniswapV2Router02.json";

import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import Web3Modal from 'web3modal'
import {loadProvider} from '../utils/provider'

function Partners(){

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
    const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];

    const [timecount , setTimecount] = useState('')
    const [data , setData] = useState([])
    const [chartSelect, setChartSelect] = useState(2)
    const [isChecked , setIsChecked] = useState([false,false,false,false,true])
    const [chartData , setChartData] = useState([])

    const selectCheck = (value,index)=>{
        console.log(value)
        if(value){
            let array = [false,false,false,false,false]
            array[index - 1] = true;
            setIsChecked(array)
            setChartSelect(index)
            rerender(index)
        }else{
            let array = [false,false,false,false,false]
            setIsChecked(array)
        }
    }


    const currentPoolTime = async () =>{
        try {

            let signer = await loadProvider()
            let stakingContract = new ethers.Contract(staking_addr, ABI, signer);
            let currentPool = await stakingContract.currentPool()
            let pool = await stakingContract.pool(1,currentPool)
            currentPool = Number(pool[6].toString())
            console.log("currentPool",currentPool)
            return currentPool

        } catch (error) {
            console.log(error)
        }
    }

    const getDetails = async () =>{
        try {

            let signer = await loadProvider()
            let stakingContract = new ethers.Contract(staking_addr, ABI, signer);
            let rewardToken_address = await stakingContract.rewardToken();
            let rewardContract = new ethers.Contract(
                rewardToken_address,
                TokenABI,
                signer
            );

            let decimals = await rewardContract.decimals();
            let currentPool = await stakingContract.currentPool()
            currentPool = Number(currentPool.toString())
            
            let temp = []
            let temp1 = []
            let start = 1
            for (let index = start; index <= currentPool; index++) {
                let depositInfo = await stakingContract.depositInfo(index)
                let obj = {}
                obj.DATE_OF_LAST_DEPOSIT = Number(depositInfo[5].toString())
                obj.TOTAL_LAST_DEPOSIT = ethers.utils.formatUnits(depositInfo[0].toString(), decimals)
                obj.SUPPORT_HEST = ethers.utils.formatUnits(depositInfo[1].toString(), decimals)
                obj.PARTNERSHIP = ethers.utils.formatUnits(depositInfo[2].toString(), decimals)
                obj.TEAM= ethers.utils.formatUnits(depositInfo[3].toString(), decimals)
                obj.MINIPOOL = ethers.utils.formatUnits(depositInfo[4].toString(), decimals)
                temp.push(obj)
                console.log("data" , obj)

                let _x = Number( ethers.utils.formatUnits( depositInfo[chartSelect].toString() , decimals))
                let _y = Number( ethers.utils.formatUnits( depositInfo[0].toString() , decimals)) - _x
                let timestamp = obj.DATE_OF_LAST_DEPOSIT * 1000;
                let date = new Date(timestamp);
                let _month = date.getMonth();
                console.log("depositInfo", month)
                console.log("depositInfo", timestamp)
                temp1.push(setValues( month[_month] , _x ,_y ,0))

            }
            console.log("data" , temp)
            setData(temp)
            setChartData(temp1)
            
        } catch (error) {
            console.log(error)
        }
    }

    const selectX = (value , index)=>{
        if(value === 1){
            return data[index ].TOTAL_LAST_DEPOSIT
        }else if(value === 2){
            return data[index ].SUPPORT_HEST
        }else if(value === 3){
            return data[index ].PARTNERSHIP
        }else if(value === 4){
            return data[index ].TEAM
        }else if(value === 5){
            return data[index ].MINIPOOL
        }
    }

    const rerender = (value)=>{
        let temp1 = []
        for (let index = 0; index < data.length; index++) {
            
                let _x = selectX(value,index)
                let _y = data[index].TOTAL_LAST_DEPOSIT - _x
                let timestamp = data[index].DATE_OF_LAST_DEPOSIT * 1000;
                let date = new Date(timestamp);
                let _month = date.getMonth();
                console.log("depositInfo", month)
                console.log("depositInfo", timestamp)
                temp1.push(setValues( month[_month - 1] , _x ,_y ,0))
            
        }
        setChartData(temp1)
    }

    const setValues = (_name , _x , _y , _z)=>{
        return { name: _name, x: _x, y: _y, z: _y }
    }

    const unixToDate = (unix_timestamp) => {
        let date = new Date(unix_timestamp * 1000);
        // Hours part from the timestamp
        let day = date.getDay();
        // Minutes part from the timestamp
        let month =  date.getMonth();
        // Seconds part from the timestamp
        let year =  date.getFullYear();

        // Will display time in 10:30:23 format
        let formattedTime = day + '/' + month + '/' + year;

        return formattedTime
    }

    useEffect(
        async ()=> {
            if(account){
                await getDetails()
            }
           // await countTime()
        }    
    ,[account])

    return <>
            <Container fluid className="main-height">
                <div className="page-margin-top">
                <Row>
                    <Col lg={12}>
                      
                     <Row>
                         <Col lg={5}>
                            <p className="mt-1 p-with-logo">In <img src={HorizontalLogo} className="in-text-logo"/> According our project details, you’re beneficiary of our team program, here you could find the information about the latest deposits made for your wallet address</p>
                         </Col>
                         <Col lg={7}>
                         <div className="mt-5">
                      <div className="payment-first-flex ">
                        <div>
                            <span>DATE OF LAST DEPOSIT:  <span className="green">(DATE)</span></span>
                        </div>
                        <div className="background-green text-white">
                        {unixToDate(data[data.length-1]?.DATE_OF_LAST_DEPOSIT)}
                        </div>
                    </div>
                    <div className="payment-first-flex">
                        <div>
                            <span>TOTAL LAST DEPOSIT <span className="green">(USDT)</span>:</span>
                        </div>
                        <div className="background-green text-white">
                         {data.at(-1)?.TOTAL_LAST_DEPOSIT}
                        </div>
                    </div>
                  
                    <div className="payment-first-flex">
                        <div>
                            <span>DEPOSIT TO PARTNER<span className="green">(USD)</span>:</span>
                        </div>
                        <div className="background-green text-white">
                         {data.at(-1)?.PARTNERSHIP}
                        </div>
                    </div>
                      </div>
                         </Col>

                     </Row>

                    </Col>


                    <Col lg={4} className="mt-5">
                        <Minipooltable />
                    </Col>

                    <Col lg={8}>
                       <div className="token-section mt-5">
                           <div className="historic-flex">
                           <div>
                           <h5 className="title-section">Historic Graph</h5>
                           <span>PARTNER</span>
                           </div>
                           </div>
                           <div className="chart-section w-100 mb-3">
                               <HistoricGraph  data ={chartData} />
                           </div>
                       </div>
                    </Col>
                  
                </Row>
                </div>
            </Container>
    </>
}
export default Partners;