import { Col, Container, Row,Table, Form } from "react-bootstrap";

import { memo, useEffect, useState } from "react";

import {staking_addr} from '../../contract/addresses'
import ABI from '../../contract/Staking.json'
import IERC20Metadata from '../../contract/IERC20Metadata.json'

import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import Web3Modal from 'web3modal'

import ERROR from '../../utils/error'
import {loadProvider} from '../../utils/provider'

import moment from "moment";
import apis from "../../services";



function AdjustPool(){

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

    const [timeCount, setTimeCount] = useState('')
    const [percentages , setPercentages] = useState([5,5,5,10,10,20,20,25])
    const [min , setMin] = useState([25,2500,9000,19000,35000,58000,100000,176000])//([25,2500,9000,19000,35000,58000,100000,176000])
    const [max , setMax] = useState([1500,5000,12000,28000,40000,90000,120000,800000000])
    const [coinValue, setCoinValue] = useState(0)
    const [IERC20Reward, setIERC20Reward] = useState({symbol :"coin" , decimals : "0" , address : null})
    const [buttonTxt , setButtonTxt] = useState('Initialize')
    const poolTitle = ["Adnvace 3","Adnvace 2","Adnvace 1", "Advantage 2" , "Advantage 1" ,"Plus 2" ,"Plus 1","Prestige"] 
    const maxvalue = 800000000


    const changeMin = (index , value) =>{
        if(value > maxvalue)
        value = maxvalue
        setMin((prevState) => {
        prevState[index] = Number(value)
        return prevState
        })
    }

    const changeMax = (index , value) =>{
        if(value > maxvalue)
        value = maxvalue

        setMax((prevState) => {
        prevState[index] = Number(value)
        return prevState
        })
        console.log(max)
    }

    const changePercentage = (index , value) =>{
        if(value > 100)
        value = 100

        setPercentages((prevState) => {
            prevState[index] = Number(value)
            return prevState
            })
            console.log(percentages)
    }

    const require = () =>{
        let result = true
        if(percentages.reduce((acc, num)=> acc+Number(num)) != 100){
            ERROR.log(`percentages does not add up to 100`)
            result = false
       }else{
        for (let index = 0; index < min.length; index++) {
            if(min[index] > max[index]){
                ERROR.log(`${poolTitle[index]} min value is greater than max value`)
                result = false
                break
            }else if(min[index] < 0 ){
                ERROR.log(`${poolTitle[index]} min value must be than 0`)
                result = false
                break

            }else if(max[index] < 0){
                ERROR.log(`${poolTitle[index]} max value must be than 0`)
                result = false
                break
            } 
        }
       }
        return result
    } 
   
    const initialize = async (e) => {
            e.preventDefault()
        try {
            if(require()){
                setButtonTxt("Processing")
                let signer = await loadProvider()
                let contract = new ethers.Contract(staking_addr, ABI, signer);
                let initialize = await contract.initiatePools(percentages,min,max)
                await initialize.wait()

                setButtonTxt("Initialize")

            }else{

            } 

        } catch (error) {
            setButtonTxt("Initialize")
            ERROR.catch_error(error, 'Initialize')
            }
        }

    const getDetail = async () =>{
        try {

            let signer = await loadProvider()
            let contract = new ethers.Contract(staking_addr, ABI, signer);
            let rewardTokenAddress = await contract.rewardToken()
            let IERC20 = new ethers.Contract(rewardTokenAddress, IERC20Metadata, signer);
            let decimals = await IERC20.decimals()
            let symbol = await IERC20.symbol()
            let obj = {
                symbol : symbol ,
                decimals: decimals,
                address : rewardTokenAddress
            }
            setIERC20Reward(obj)
            
        } catch (error) {
            ERROR.catch_error(error, 'getDetail')    
        }
    }
    

    const addRewardToken = async () => {
       // e.preventDefault()
    try {
       
           // setButtonTxt("Processing")
            let signer = await loadProvider()
            let contract = new ethers.Contract(staking_addr, ABI, signer);
            let IERC20 = new ethers.Contract(IERC20Reward.address, IERC20Metadata, signer);
            let allowance = await IERC20.allowance(account , staking_addr)
            let _value = await ethers.utils.parseUnits(coinValue.toString(),IERC20Reward.decimals)
            console.log(allowance.toString())
            if(Number(allowance.toString()) === 0){
                console.log("inn")
                let approve = await IERC20.approve(staking_addr , _value)
                let tx = await approve.wait()
                if(tx.confirmations > 0){
                    let add = await contract.addRewardToken(_value)
                    await add.wait()
                }
            }else{
                console.log("out")
                let add = await contract.addRewardToken(_value)
                await add.wait()
            }


    } catch (error) {
        ERROR.catch_error(error, 'addRewardToken')
       
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

  const countTime = async () => {
    try {
        const {data} = await apis.getBlock(await currentPoolTime())
        console.log("data", data)
        const timeStamp =  data?.result?.timeStamp || 0;//0
        let oneMonthUNIX = 2163
        let totalTime = Number(timeStamp) + oneMonthUNIX
        console.log("NOW", moment().unix())
        console.log("NOW", timeStamp)
        if (totalTime < moment().unix())
            totalTime = 0

        console.log("3  ",totalTime)
        let date = moment.unix(Number(totalTime));
        //a.to(date)

        console.log("2timeStamp", moment().countdown(date))
        console.log("moment().countdown(date).value", moment().countdown(date).value)

        if (moment().countdown(date).value > 0) {
            console.log("INNS")

            const id = setInterval(() => {

                setTimeCount(moment().countdown(date))

                console.log("2timeStamp" ,moment().countdown(date).toString()) 
                // console.log("2timeStamp" ,moment().countdown(date).toString()) 
                // console.log("3timeStamp" ,moment().countdown(date , countdown.MONTHS|countdown.WEEKS, NaN, 2).toString()) 


            }, 1000);
        }
    } catch (error) {
        console.log(error)
    }
}

useEffect(async () => {
  if(account){
    await countTime()
  }
  
}, [account]);

    

    useEffect(()=>{
        (async ()=>{
          if(library && account){
            try {
                await getDetail()
            }
            catch(error){
        
            }
            return () => {
            };
          }
        })();
      }, [library, account, chainId]);

    return <>
            <Container fluid className="main-height">
            

                <Row>

                    <Col xl={12} lg={12}>

                        <div className="page-margin-top">

                        <div className="how-it-work">
                            <h5 className="section-title">ADJUST MINIPOOLS</h5>
                        </div>

                        </div>

                        <div className="trade-section admin">

                            <h5 class="section-title">Stake - MiniPools</h5>

                            <div className="select-minipool">

                                <div>
                                <p class="head mb-0">Select a MiniPool</p>
                                <p class="light-small-p">HEST Balance Required</p>
                                </div>

                                <div className="d-flex align-items-center">
                                    <span className="border-bg">Add Reward to Current Pools</span>
                                    
                                    <span className="border-bg d-flex-input"><input type="number" placeholder="100" className="input-none-style" onChange={(e)=>setCoinValue(e.target.value)}/> <sub>{IERC20Reward.symbol}</sub></span>
                
                                    
                                    <button class=" border-bg" onClick={addRewardToken}>Add Coin</button>
                                    <div className="position-relative">
                                        <p className="light-small-p absolute-p">REMAINING TIME TO CLOSE</p>
                                        <span className="border-bg">{timeCount?.days !== undefined  ? timeCount?.months > 0 ?  30*timeCount?.months: timeCount?.days : 0} : {timeCount?.hours !== undefined ? timeCount?.hours :"00"} : {timeCount?.minutes !== undefined ? timeCount?.minutes :"00"} : {timeCount?.seconds !== undefined ? timeCount?.seconds :"00"}</span>
                                    </div>
                                </div>


                            </div>

                            <Form className="minipool-form admin">

                           
                                    {poolTitle.map((title,index) => (
                                        <div className="minipool-check">
                                        <div class="form-check">
                                            <label class="form-check-label" for="check1">
                                                 {title}
                                                <span>{min[2]} - {max[2]}</span>
                                            </label>
                                        </div>
                                        
                                        <div className="form-check-basis">
                                        <div className="with-label">
                                        <label for="" className="custom-label-new">Percentage</label>
                                        <span className="border-bg d-flex">
                                            <input type="number" placeholder={percentages[index] + "%"} onChange = {(e)=> changePercentage(index , e.target.value)} className="input-none-style"/>
                                        </span>
                                        </div>
                                        <div className="with-label">
                                        <label for="" className="custom-label-new">Min Hest</label>

                                        <span className="border-bg d-flex-input"><input type="number" placeholder={min[index]} onChange = {(e)=> changeMin(index , e.target.value)} className="input-none-style"/> <sub>HEST</sub></span>

                                        </div>
                                        <div className="with-label">
                                        <label for="" className="custom-label-new">Max Hest</label>

                                            <span className="border-bg d-flex-input"><input type="number" placeholder={max[index]} onChange = {(e)=> changeMax(index , e.target.value)} className="input-none-style"/> <sub>HEST</sub></span>
                                        </div>
                                        </div>

                                    </div>
                                    ))}
                              
                                   <button class="small-btn" onClick={(e) => initialize(e)}>{buttonTxt}</button>
                            </Form>
                           
                        </div>
                        
                    </Col>


                </Row>
            </Container>
    </>
}
export default AdjustPool;