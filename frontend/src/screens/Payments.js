import {Col, Container, Row} from "react-bootstrap";
import HorizontalLogo from '../assets/images/horizontal-logo.png'
import {HistoricGraph} from '../components/Index';
import {useEffect, useState} from "react";
import apis from "../services";
import moment from "moment";

import {staking_addr,} from "../contract/addresses";

import ABI from "../contract/Staking.json";
import TokenABI from "../contract/HESTOKEN.json";

import {useWeb3React} from "@web3-react/core";
import {ethers} from "ethers";
import {loadProvider} from '../utils/provider'

function Payments() {

    const {account} = useWeb3React();
    const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const [timeCount, setTimeCount] = useState('')
    const [data, setData] = useState([])
    const [chartSelect, setChartSelect] = useState(4)
    const [isChecked, setIsChecked] = useState([false, false, false, false, true])
    const [chartData, setChartData] = useState([])

    const selectCheck = (value, index) => {
        console.log(value)
        if (value) {
            let array = [false, false, false, false, false]
            array[index - 1] = true;
            setIsChecked(array)
            setChartSelect(index)
            rerender(index)
        } else {
            let array = [false, false, false, false, false]
            setIsChecked(array)
        }
    }


    const currentPoolTime = async () => {
        try {

            let signer = await loadProvider()
            let stakingContract = new ethers.Contract(staking_addr, ABI, signer);
            let currentPool = await stakingContract.currentPool()
            let pool = await stakingContract.pool(1, currentPool)
            currentPool = Number(pool[6].toString())
            console.log("currentPool", currentPool)
            return currentPool

        } catch (error) {
            console.log(error)
        }
    }

    const getDetails = async () => {
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
                obj.TEAM = ethers.utils.formatUnits(depositInfo[3].toString(), decimals)
                obj.MINIPOOL = ethers.utils.formatUnits(depositInfo[4].toString(), decimals)
                temp.push(obj)
                console.log("data", obj)

                let _x = Number(ethers.utils.formatUnits(depositInfo[chartSelect].toString(), decimals))
                let _y = Number(ethers.utils.formatUnits(depositInfo[0].toString(), decimals)) - _x
                let timestamp = obj.DATE_OF_LAST_DEPOSIT * 1000;
                let date = new Date(timestamp);
                let _month = date.getMonth();
                console.log("depositInfo", month)
                console.log("depositInfo", timestamp)
                temp1.push(setValues(month[_month - 1], _x, _y, 0))

            }
            console.log("data", temp)
            setData(temp)
            setChartData(temp1)

        } catch (error) {
            console.log(error)
        }
    }

    const selectX = (value, index) => {
        if (value === 1) {
            return data[index].TOTAL_LAST_DEPOSIT
        } else if (value === 2) {
            return data[index].SUPPORT_HEST
        } else if (value === 3) {
            return data[index].PARTNERSHIP
        } else if (value === 4) {
            return data[index].TEAM
        } else if (value === 5) {
            return data[index].MINIPOOL
        }
    }

    const rerender = (value) => {
        let temp1 = []
        for (let index = 0; index < data.length; index++) {

            let _x = selectX(value, index)
            let _y = data[index].TOTAL_LAST_DEPOSIT - _x
            let timestamp = data[index].DATE_OF_LAST_DEPOSIT * 1000;
            let date = new Date(timestamp);
            let _month = date.getMonth();
            console.log("depositInfo", month)
            console.log("depositInfo", timestamp)
            temp1.push(setValues(month[_month - 1], _x, _y, 0))

        }
        setChartData(temp1)
    }

    const setValues = (_name, _x, _y, _z) => {
        return {name: _name, x: _x, y: _y, z: _y}
    }

    const unixToDate = (unix_timestamp) => {
        let date = new Date(unix_timestamp * 1000);
        // Hours part from the timestamp
        let day = date.getDay();
        // Minutes part from the timestamp
        let month = date.getMonth();
        // Seconds part from the timestamp
        let year = date.getFullYear();

        // Will display time in 10:30:23 format
        let formattedTime = day + '/' + month + '/' + year;

        return formattedTime
    }

    const countTime = async () => {
        try {

            const {data} = await apis.getBlock(await currentPoolTime())
            const timeStamp = data?.result?.timeStamp || 0;
            let oneMonthUNIX = 2629743
            let totalTime = Number(timeStamp) + oneMonthUNIX
            console.log("NOW", moment().unix())
            if (totalTime < moment().unix())
                totalTime = 0

            console.log(totalTime)
            let date = moment.unix(Number(totalTime));
            //a.to(date)

            console.log("2timeStamp", moment().countdown(date))
            console.log("moment().countdown(date).value", moment().countdown(date).value)

            if (moment().countdown(date).value > 0) {
                console.log("INNS")

                const id = setInterval(() => {

                    setTimeCount(moment().countdown(date))

                    // console.log("2timeStamp" ,moment().countdown(date).toString()) 
                    // console.log("2timeStamp" ,moment().countdown(date).toString()) 
                    // console.log("3timeStamp" ,moment().countdown(date , countdown.MONTHS|countdown.WEEKS, NaN, 2).toString()) 


                }, 1000);
            }
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(
        async () => {
            if (account) {
                await getDetails()
            }
            // await countTime()
        }
        , [account])

    const payments = [
        {
            label: 'DATE OF LAST DEPOSIT',
            value: unixToDate(data[data.length - 1]?.DATE_OF_LAST_DEPOSIT),
            currency: false
        },
        {label: 'TOTAL LAST DEPOSIT', value: data.at(-1)?.TOTAL_LAST_DEPOSIT, currency: true},
        {label: 'DEPOSIT MADE TO SUPPORT HEST', value: data.at(-1)?.SUPPORT_HEST, currency: true},
        {label: 'DEPOSIT MADE TO TEAM', value: data.at(-1)?.TEAM, currency: true},
        {label: 'DEPOSIT MADE TO PARTNERSHIP', value: data.at(-1)?.PARTNERSHIP, currency: true},
        {label: 'TOTAL SHARING AMOUNT TO STAKE', value: data.at(-1)?.MINIPOOL, currency: true},

    ]

    return <>
        <Container fluid className="main-height">
            <div className="page-margin-top">
                <Row>
                    <Col lg={5}>

                        <p className="mt-2 p-with-logo">In <img src={HorizontalLogo} className="in-text-logo"/> we
                            believe in the cryptocurrencies for this reason, we created our own token, where we are
                            sharing monthly a percentage of our earnings by our services and solutions offering into the
                            energy sector, these payments come from our billing account, and it represents a way to
                            support people that trust in our projects, activities and operations making them part of our
                            growing up process.</p>
                        <div className="payment-top-margin">
                            {payments.map(({label, value, currency}, index) => (
                                <div className="payment-first-flex" key={index}>
                                    <div>
                                        <span>{label}{currency && <span className="green">(USDT)</span>}:</span>
                                    </div>
                                    <div className="background-green text-white">
                                        {value}
                                    </div>
                                </div>
                            ))
                            }
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
                                            <span>{timeCount.days}</span>
                                            <span>{timeCount.hours}</span>
                                            <span>{timeCount.minutes}</span>
                                            <span>{timeCount.seconds}</span>
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
                                    <input type="checkbox" checked={isChecked[0]}
                                           onChange={(e) => selectCheck(e.target.checked, 1)}/>
                                    <span>DEPOSITS</span>
                                </div>
                                <div>
                                    <h5 className="title-section">Historic Graph</h5>
                                    <input type="checkbox" checked={isChecked[1]}
                                           onChange={(e) => selectCheck(e.target.checked, 2)}/>
                                    <span>SUPPLY</span>
                                </div>
                                <div className="filter">
                                    <div className="flex">
                                        <div>
                                            <input type="checkbox" checked={isChecked[2]}
                                                   onChange={(e) => selectCheck(e.target.checked, 3)}/>
                                            <span>Partners</span>

                                        </div>

                                    </div>
                                    <div className="flex">
                                        <div>
                                            <input type="checkbox" checked={isChecked[3]}
                                                   onChange={(e) => selectCheck(e.target.checked, 4)}/>
                                            <span>Team</span>

                                        </div>

                                    </div>
                                    <div className="flex">
                                        <div>
                                            <input type="checkbox" checked={isChecked[4]}
                                                   onChange={(e) => selectCheck(e.target.checked, 5)}/>
                                            <span>Stake - MiniPools</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="chart-section w-100">
                                <HistoricGraph data={chartData}/>
                            </div>
                        </div>
                    </Col>

                </Row>
            </div>
        </Container>
    </>
}

export default Payments;