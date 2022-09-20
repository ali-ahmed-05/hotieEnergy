import { Col, Container, Row } from "react-bootstrap";
import HorizontalLogo from '../assets/images/horizontal-logo.png'
import {HistoricGraph} from '../components/Index';
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

function Payments(){

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

    const [timecount , setTimecount] = useState('')
    const [data , setData] = useState([])


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
            let HestContract = new ethers.Contract(hestoken_addr, TokenABI, signer);
            let decimals = await HestContract.decimals();
            let currentPool = await stakingContract.currentPool()
            currentPool = Number(currentPool.toString())
            
            let temp = []
            let start = 1
            for (let index = start; index <= currentPool; index++) {
                let depositInfo = await stakingContract.depositInfo(currentPool)
                let obj = {}
                obj.DATE_OF_LAST_DEPOSIT = Number(depositInfo[5].toString())
                obj.TOTAL_LAST_DEPOSIT = ethers.utils.formatEthers(depositInfo[0].toString(), decimals)
                obj.SUPPORT_HEST = ethers.utils.formatEthers(depositInfo[1].toString(), decimals)
                obj.PARTNERSHIP = ethers.utils.formatEthers(depositInfo[2].toString(), decimals)
                obj.TEAM= ethers.utils.formatEthers(depositInfo[3].toString(), decimals)
                obj.MINIPOOL = ethers.utils.formatEthers(depositInfo[4].toString(), decimals)
                temp.push(obj)
                // let snapshot = await stakingContract.stakeSnapshot(account,index)
                // let _x = ethers.utils.formatUnits( snapshot[0].toString() , decimals)
                // let timestamp = Number(snapshot[1].toString()) * 1000;
                // let date = new Date(timestamp);
                // let _month = date.getMonth();
                // console.log("snapshot", month)
                // console.log("snapshot", timestamp)
                // temp.push(setValues( month[_month - 1] , _x ,0 ,0))
            }
            setData(temp)
            
        } catch (error) {
            console.log(error)
        }
    }

    const countTime = async ()=> {
        try {

            const {data} = await apis.getBlock(await currentPoolTime())
            const timeStamp = data?.result?.timeStamp || 0;
            let oneMonthUNIX  = 2629743
            let totalTime = Number(timeStamp) + oneMonthUNIX
            console.log("NOW" ,moment().unix())
            if(totalTime < moment().unix())
            totalTime = 0 

            console.log(totalTime)
            let date = moment.unix(Number(totalTime));
            //a.to(date)

            console.log("2timeStamp" ,moment().countdown(date)) 
            console.log("moment().countdown(date).value" ,moment().countdown(date).value) 

            if(moment().countdown(date).value > 0){
                console.log("INNS")
            
            const id = setInterval(() => {
                
                 setTimecount(moment().countdown(date))

                // console.log("2timeStamp" ,moment().countdown(date).toString()) 
                // console.log("2timeStamp" ,moment().countdown(date).toString()) 
                // console.log("3timeStamp" ,moment().countdown(date , countdown.MONTHS|countdown.WEEKS, NaN, 2).toString()) 

               
              }, 1000);
            }
        }
         catch (error) {
            console.log(error)
        }
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
                    <Col lg={5}>
                      
                      <p className="mt-2 p-with-logo">In <img src={HorizontalLogo} className="in-text-logo"/> we believe in the cryptocurrencies for this reason, we created our own token, where we are sharing monthly a percentage of our earnings by our services and solutions offering into the energy sector, these payments come from our billing account, and it represents a way to support people that trust in our projects, activities and operations making them part of our growing up process.</p>
                      <div className="payment-top-margin">
                      <div className="payment-first-flex">
                        <div>
                            <span>DATE OF LAST DEPOSIT</span>
                        </div>
                        <div className="background-green">
                            .
                        </div>
                    </div>
                    <div className="payment-first-flex">
                        <div>
                            <span>TOTAL LAST DEPOSIT <span className="green">(USDT)</span>:</span>
                        </div>
                        <div className="background-green">
                            .
                        </div>
                    </div>
                    <div className="payment-first-flex">
                        <div>
                            <span>DEPOSIT MADE TO SUPPORT HEST <span className="green">(USD)</span>:</span>
                        </div>
                        <div className="background-green">
                            .
                        </div>
                    </div>
                    <div className="payment-first-flex">
                        <div>
                            <span>DEPOSIT MADE TO TEAM <span className="green">(USD)</span>:</span>
                        </div>
                        <div className="background-green">
                            .
                        </div>
                    </div>
                    <div className="payment-first-flex">
                        <div>
                            <span>DEPOSIT MADE TO PARTNERSHIP <span className="green">(USD)</span>:</span>
                        </div>
                        <div className="background-green">
                            .
                        </div>
                    </div>
                    <div className="payment-first-flex">
                        <div>
                            <span>TOTAL SHARING AMOUNT TO STAKE <span className="green">(USD)</span>:</span>
                        </div>
                        <div className="background-green">
                            .
                        </div>
                    </div>
                   
                      </div>
                    </Col>
                    <Col lg={7}>
                       <div className="token-section">
                           <div className="balance-section">
                               <h5 className="section-title">NEXT PAYMENT</h5>
                               <span>WILL RELEASE IN :</span>
                           </div>
                           <div className="payment-flex">
                               <div className="inner flex">
                               <div className="timer-icon-section">
                               <i class="fa-solid fa-stopwatch"></i>
                               </div>
                               <div className="inner flex-column">
                                   <div>
                                   <span>DAYS</span>
                                   <span>HRS</span>
                                   <span>MIN</span>
                                   <span>SEC</span>
                                   </div>
                                   <div className="green-background timer-section">
                                       <span>{timecount.days}</span>
                                       <span>{timecount.hours}</span>
                                       <span>{timecount.minutes}</span>
                                       <span>{timecount.seconds}</span>
                                   </div>
                               </div>
                               </div>
                              
                               <div className="inner flex">
                                   <div className="inner-flex">
                                   <span>HEST WILL RECEIVE:</span>
                                   </div>
                                   <div className="flex-with-name">
                                   <div className="inner-flex green-background amount-section">
                                   <span>76,500.00</span>
                                   </div>
                                   <span className="name green">HEST</span>
                                   </div>
                               </div>
                           </div>
                           <div className="payment-flex">
                               <div className="inner flex">
                                   <div className="inner-flex">
                                   <span>VALUE:</span>
                                   </div>
                                   <div className="flex-with-name">
                                   <div className="inner-flex green-background amount-section">
                                   <span>150,000.00</span>
                                   </div>
                                   <span className="name green">USD</span>
                                   </div>
                               </div>
                               <div className="inner flex">
                                   <div className="inner-flex">
                                   <span>CLAIMABLE BALANCE:</span>
                                   </div>
                                   <div className="flex-with-name">
                                   <div className="inner-flex green-background amount-section">
                                   <span>58,500.00</span>
                                   </div>
                                   <span className="name green">USD</span>
                                   </div>
                               </div>
                           </div>
                       </div>
                       <div className="token-section mt-5">
                           <div className="historic-flex">
                           <div>
                           <h5 className="title-section">Historic Graph</h5>
                           <span>DEPOSITS</span>
                           </div>
                           <div className="filter">
                               <div className="flex">
                               <div>
                                   <input type="checkbox"/>
                                   <span>Team</span>
                               </div>
                               <div>
                                   <input type="checkbox"/>
                                   <span>All</span>
                               </div>
                               </div>
                              <div className="flex">
                              <div >
                                   <input type="checkbox"/>
                                   <span>Partners</span>
                               </div>
                               <div>
                                   <input type="checkbox"/>
                                   <span>Token</span>
                               </div>
                              </div>
                              <div className="flex">
                               <div>
                                   <input type="checkbox"/>
                                   <span>Stake - MiniPools</span>
                               </div>
                              </div>
                           </div>
                           </div>
                           <div className="chart-section w-100">
                               <HistoricGraph/>
                           </div>
                       </div>
                    </Col>
                  
                </Row>
                </div>
            </Container>
    </>
}
export default Payments;