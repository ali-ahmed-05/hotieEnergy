import { Col, Container, Row, Table, Form } from "react-bootstrap";
import Hest from "../assets/images/hest.png";
import Minipooltable from "../components/MiniPoolTable";
import whitepaper from "../assets/WHITEPAPER.pdf";
import { useNavigate } from "react-router-dom";

import { memo, useEffect, useState } from "react";
import {
  staking_addr,
  hestoken_addr,
  router_addr,
} from "../contract/addresses";

import ABI from "../contract/Staking.json";
import TokenABI from "../contract/HESTOKEN.json";
import RouterABI from "../contract/IUniswapV2Router02.json";
import IERC20Metadata from "../contract/IERC20Metadata.json";

import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import apis from "../services";
import CompoundModal from "../components/modals/CompoundModal";

import { loadProvider } from '../utils/provider'
import ERROR from "../utils/error";

import moment from "moment";

function Stake() {
  const [pools, setPools] = useState([]);
  const poolTitle = ["Adnvace 3","Adnvace 2","Adnvace 1", "Advantage 2" , "Advantage 1" ,"Plus 2" ,"Plus 1","Prestige"]
  const [currentPool, setcurrentPool] = useState();

  const [TotalRewardBalance , setTotalRewardBalance] = useState(0)
  const [TotalRewardClaimable , setTotalRewardClaimable] = useState(0)
  const [recomendedPool , setRecomendedPool] = useState(0)
  const [hestBalance , setHESTBalance] = useState(0)
  const [stakedBalance, setStakedBalance] = useState();
  const [toUSD , settoUSD] = useState()
  const [compoundModal, setCompoundModal] = useState(false);
  const [selectedPools, setSelectedPools] = useState([]);
  const [poolrewards , setpoolrewards] = useState(0)
  const [timeCount, setTimeCount] = useState('')

  const toggleModalState = () => setCompoundModal(prevState => !prevState);

  console.log(selectedPools);

  const handleSelectPool = (index) => {
    if(selectedPools.includes(index)){
      setSelectedPools(prevState => prevState.filter(pool => pool !== index));
    }else{
      setSelectedPools(prevState => [...prevState, index]);
    }
    console.log(selectedPools)
  }

  const handleClubStake = () => {
    alert('Club Stake');
  }

  const compoundModalProps = {poolTitle, status: compoundModal, handleClose: toggleModalState, handleSelectPool, TotalRewardBalance,hestBalance,stakedBalance,handleClubStake };

  const {
    connector,
    library,
    account,
    chainId,
    activate,
    deactivate,
    active,
    error,
  } = useWeb3React();

  const valuetoRewardToken = async (amount , path , decimals) => {
    try {
        let signer = await loadProvider()
        let Routercontract = new ethers.Contract(router_addr, RouterABI, signer);
        let value = await Routercontract.getAmountsOut(amount,path)

        console.log("getAmountsOut" , value)
        console.log("getAmountsOut" , value[1].toString())
        

        value = Number(ethers.utils.formatUnits(value[1].toString(),decimals)).toFixed(5)

        console.log("getAmountsOut" , value)

        return value.toString()

    } catch (error) {
        console.log(error)
    }
}

  const getCurrentPool = async () => {
    try {
      let signer = await loadProvider();
      let stakingContract = new ethers.Contract(staking_addr, ABI, signer);
    } catch (error) {
      console.log("getCurrentPool", error);
    }
  };

  const totalRewards = async (_currentPool , stakingContract , decimals) => {
    try {
        let temp = 0
        let claim = 0
        console.log("_currentPool" , _currentPool)
        for (let index = 1; index <= _currentPool; index++) {

            for (let id = 1; id < 9; id++) {
              
                let totalRewardBlance  = await stakingContract.totalReward(account,id,index,id)
                temp += Number( ethers.utils.formatUnits(totalRewardBlance.toString(), decimals))
                console.log("totalRewards",id,Number( ethers.utils.formatUnits(totalRewardBlance.toString(), decimals)))
                if(index != _currentPool)
                claim += Number( ethers.utils.formatUnits(totalRewardBlance.toString(), decimals))

            }
        }
        
        console.log("totalRewards",temp)

        setTotalRewardBalance(temp.toFixed(5))
        setTotalRewardClaimable(claim.toFixed(5))
        
    } catch (error) {
        console.log(error)
    }
  }

  const redeem = async ()=>{
    try {
      let signer = await loadProvider();
      let stakingContract = new ethers.Contract(staking_addr, ABI, signer );
      let clubsend = await stakingContract.clubRewards(account , true , [])
      await clubsend.wait()
    } catch (error) {
        ERROR.catch_error(error,'redeem')
    }
  }

  const poolDetail = async (signer) => {
    try {
      let stakingContract = new ethers.Contract(staking_addr, ABI, signer);
      let HestContract = new ethers.Contract(hestoken_addr, TokenABI, signer);
      let HestDecimals = await HestContract.decimals();
      let HestBalance = Number( ethers.utils.formatUnits(( await HestContract.balanceOf(account)).toString(),HestDecimals))
      setHESTBalance(HestBalance)
      let rewardToken_address = await stakingContract.rewardToken();
      let rewardContract = new ethers.Contract(
        rewardToken_address,
        TokenABI,
        signer
      );

      let reward_decimals = await rewardContract.decimals();
      let _hesttemp_balance = ethers.utils.parseUnits(HestBalance.toString(),HestDecimals)
      let getAmountsOut = await valuetoRewardToken(_hesttemp_balance , [hestoken_addr , rewardToken_address],reward_decimals)

      settoUSD(getAmountsOut)

      let _currentPool = await stakingContract.currentPool();
      _currentPool = Number(_currentPool.toString());

      setcurrentPool(_currentPool);

      await totalRewards(_currentPool,stakingContract,reward_decimals)

      let pool = [];
      let poolreward = 0

      for (let inn = 1; inn < 9; inn++) {
        let pool_data = await stakingContract.pool(inn, _currentPool);
        pool.push({
          id: pool_data[0].toString(),
          totalstaked: ethers.utils.formatUnits(
            pool_data[1].toString(),
            HestDecimals
          ),
          rewardTokenValue: ethers.utils.formatUnits(
            pool_data[2].toString(),
            reward_decimals
          ),
          min: ethers.utils.formatUnits(pool_data[3].toString(), HestDecimals),
          max: ethers.utils.formatUnits(pool_data[4].toString(), HestDecimals),
          noOfusers: pool_data[5].toString(),
          creationTime: Number(pool_data[6].toString()),
          cent: Number(pool_data[7].toString()),
        });

        poolreward += Number(pool[pool.length-1].rewardTokenValue)

        

        if(HestBalance >= pool[pool.length-1].min){
          setRecomendedPool(pool.length-1)
          console.log("setRecomendedPool", pool.length-1 )
        }

        
      }
      setpoolrewards(poolreward)

      setPools(pool);
      console.log(pool);
    } catch (error) {
      console.log(error);
    }
  };

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

  useEffect(async () => {
    await poolDetail(await loadProvider());
  }, [account]);

 

  const navigate = useNavigate();
  return (
    <>
      <Container fluid className="main-height">
        <Row>
          <Col xl={8} lg={12}>
            <div className="page-margin-top">
              <div className="how-it-work">
                <h5 className="section-title">YOUR BALANCE</h5>
                <a
                  href="#"
                  target="_blank"
                  className="custom-btn secondary-btn"
                  onClick={() => window.open(whitepaper)}
                >
                  How it works
                </a>
              </div>

              <p className="pt-4">Balance of  
              {
                                account?
                               ' '+ account?.slice(0,7) + '...' + account?.slice(account?.length - 4,account?.length)
                            : ' '+"0x000000" }
              </p>

              <div className="">
                <div className="w-100">
                  <div className="wallet-blnc">
                    <div className="text-center">
                      <p className="light-p">Wallet Balance:</p>
                      <div className="hest-to-usd">
                        <span>{hestBalance} HEST</span>
                        <span>~</span>
                        <span>{toUSD} USD</span>
                      </div>

                      {/* <button class="custom-btn secondary-btn">Stake</button> */}
                    </div>

                    {/* <div className="text-center">
                      <p className="light-p">Wallet Balance:</p>
                      <div className="hest-to-usd">
                        <span>1 HEST</span>
                        <span>~</span>
                        <span>0.085 USD</span>
                      </div>

                      <button class="custom-btn secondary-btn">Unstake</button>
                    </div> */}
                    <div className="text-center">
                      <p className="light-p">Total Estimated Reward Balance:</p>
                      <div className="hest-to-usd py-2">
                        <span>{TotalRewardBalance}</span>
                        <span>USD</span>
                      </div>

                      

                      

                    </div>
                    <div className="text-center">
                    <p className="light-p">Total Reward Claimable:</p>
                      <div className="hest-to-usd py-2">
                        <span>{TotalRewardClaimable}</span>
                        <span>USD</span>
                      </div>
                      
                      <div className="d-flex flex-column">
                        <button class="custom-btn secondary-btn mb-3" onClick={toggleModalState}>
                          Compound
                        </button>
                        <button class="custom-btn secondary-btn" onClick={redeem}>Redeem</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="trade-section">
              <div className="select-month-main">
                <h5 class="section-title">Stake - MiniPools</h5>
                <div className="position-relative">
                  {/* <p className="light-small-p ">Select Month</p> */}
                  {/* <select className="form-control" style={{ width: "200px" }}>
                    <option value="">This Month</option>
                    <option value="">Last Month</option>
                  </select> */}
                </div>
              </div>
              <div className="select-minipool mt-4">
                <div>
                  <p class="head mb-0">Select a MiniPool</p>
                  <p class="light-small-p">HEST Balance Required</p>
                </div>

                <div className="d-flex align-items-center">
                  <span className="border-bg">Total Reward</span>
                  <span className="border-bg">
                    {poolrewards} <sub>USD</sub>
                  </span>
                  <div className="position-relative">
                    <p className="light-small-p absolute-p">
                      REMAINING TIME TO CLOSE
                    </p>
                    <span className="border-bg">{timeCount?.days !== undefined  ? timeCount?.months > 0 ?  30*timeCount?.months: timeCount?.days : 0} : {timeCount?.hours !== undefined ? timeCount?.hours :"00"} : {timeCount?.minutes !== undefined ? timeCount?.minutes :"00"} : {timeCount?.seconds !== undefined ? timeCount?.seconds :"00"}</span>
                  </div>
                </div>
              </div>
              {/* <span>{timeCount?.days !== undefined ? timeCount?.days : 0}</span>
                                            <span>{timeCount?.hours !== undefined ? timeCount?.hours :0}</span>
                                            <span>{timeCount?.minutes !== undefined ? timeCount?.minutes :0}</span>
                                            <span>{timeCount?.seconds !== undefined ? timeCount?.seconds :0}</span> */}

              <Form className="minipool-form">
                {/* <input class="form-check-input" type="checkbox" value="" id="check1"/> */}
                {pools.map((value, key) => {
                   
                   return <>

                   <div className="minipool-check">
                    <div class="form-check">
                      <label class="form-check-label" for="check1">
                        {poolTitle[key]}
                        <span>{value.min} - {value.max}</span>
                      </label>
                    </div>

                    <div className="form-check-basis">
                    <div className="with-label">
                      <label for="" className="custom-label-new">Percentage</label>
                      <span className="border-bg d-flex">{value.cent}%</span>
                    </div>
                    <div className="with-label">
                      <label for="" className="custom-label-new">Min Hest</label>
                      <span className="border-bg d-flex">
                      {value.min} <sub>HEST</sub>
                      </span>
                    </div>
                    <div className="with-label">
                      <label for="" className="custom-label-new">Max Hest</label>
                      <span className="border-bg d-flex">{value.max} <sub>HEST</sub></span>
                    </div>
                    <div className="with-label">
                      <label for="" className="custom-label-new"></label>
                      <button
                        class="custom-btn secondary-btn d-flex"
                        onClick={() => navigate(`/pool-detail/${key}`,{state: { data: value, poolTitle : poolTitle[key] , currentPool } })}
                      >
                        Join
                      </button>
                    </div>
                    </div>
                  </div>
                   </>

                })}

                {/* <div className="minipool-check">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="check1"
                    />
                    <label class="form-check-label" for="check1">
                      Prestige
                      <span>176,000 - above</span>
                    </label>
                  </div>

                  <div className="form-check-basis">
                    <span className="border-bg">25</span>
                    <span className="border-bg">
                      14,625 <sub>USDT</sub>
                    </span>
                    <span className="border-bg">4</span>
                    <button class="custom-btn secondary-btn">Join</button>
                  </div>
                </div>

                <div className="minipool-check">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="check1"
                    />
                    <label class="form-check-label" for="check1">
                      Prestige
                      <span>176,000 - above</span>
                    </label>
                  </div>

                  <div className="form-check-basis">
                    <span className="border-bg">25</span>
                    <span className="border-bg">
                      14,625 <sub>USDT</sub>
                    </span>
                    <span className="border-bg">4</span>
                    <button class="custom-btn secondary-btn">Join</button>
                  </div>
                </div>

                <div className="minipool-check">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="check1"
                    />
                    <label class="form-check-label" for="check1">
                      Prestige
                      <span>176,000 - above</span>
                    </label>
                  </div>

                  <div className="form-check-basis">
                    <span className="border-bg">25</span>
                    <span className="border-bg">
                      14,625 <sub>USDT</sub>
                    </span>
                    <span className="border-bg">4</span>
                    <button class="custom-btn secondary-btn">Join</button>
                  </div>
                </div>

                <div className="minipool-check">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="check1"
                    />
                    <label class="form-check-label" for="check1">
                      Prestige
                      <span>176,000 - above</span>
                    </label>
                  </div>

                  <div className="form-check-basis">
                    <span className="border-bg">25</span>
                    <span className="border-bg">
                      14,625 <sub>USDT</sub>
                    </span>
                    <span className="border-bg">4</span>
                    <button class="custom-btn secondary-btn">Join</button>
                  </div>
                </div>

                <div className="minipool-check">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="check1"
                    />
                    <label class="form-check-label" for="check1">
                      Prestige
                      <span>176,000 - above</span>
                    </label>
                  </div>

                  <div className="form-check-basis">
                    <span className="border-bg">25</span>
                    <span className="border-bg">
                      14,625 <sub>USDT</sub>
                    </span>
                    <span className="border-bg">4</span>
                    <button class="custom-btn secondary-btn">Join</button>
                  </div>
                </div>

                <div className="minipool-check">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="check1"
                    />
                    <label class="form-check-label" for="check1">
                      Prestige
                      <span>176,000 - above</span>
                    </label>
                  </div>

                  <div className="form-check-basis">
                    <span className="border-bg">25</span>
                    <span className="border-bg">
                      14,625 <sub>USDT</sub>
                    </span>
                    <span className="border-bg">4</span>
                    <button class="custom-btn secondary-btn">Join</button>
                  </div>
                </div>

                <div className="minipool-check">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="check1"
                    />
                    <label class="form-check-label" for="check1">
                      Prestige
                      <span>176,000 - above</span>
                    </label>
                  </div>

                  <div className="form-check-basis">
                    <span className="border-bg">25</span>
                    <span className="border-bg">
                      14,625 <sub>USDT</sub>
                    </span>
                    <span className="border-bg">4</span>
                    <button class="custom-btn secondary-btn">Join</button>
                  </div>
                </div>

                <div className="minipool-check">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="check1"
                    />
                    <label class="form-check-label" for="check1">
                      Prestige
                      <span>176,000 - above</span>
                    </label>
                  </div>

                  <div className="form-check-basis">
                    <span className="border-bg">25</span>
                    <span className="border-bg">
                      14,625 <sub>USDT</sub>
                    </span>
                    <span className="border-bg">4</span>
                    <button class="custom-btn secondary-btn">Join</button>
                  </div> */}
                {/* </div> */}
              </Form>
            </div>
          </Col>

          <Col xl={4} lg={12}>
            <div className="trade-section">
              <p className="head">Recommended MiniPools</p>

            

              <div className="stake-meta">
                <div className="stake-meta-div">
                  <p>MiniPool Selected</p>
                  <h4 className="head">{poolTitle[recomendedPool]}</h4>
                </div>

                <div className="stake-meta-div">
                  <p>MiniPool %</p>
                  <h4 className="head">{pools[recomendedPool]?.cent}</h4>
                </div>

                <div className="stake-meta-div">
                  <p>MiniPool Minimum Holding</p>
                  <h4 className="head">
                  {pools[recomendedPool]?.min}<sub>USD</sub>
                  </h4>
                </div>

                <div className="stake-meta-div">
                  <p>MiniPool Maximum Holding</p>
                  <span>Actual</span>
                  <h4 className="head">{pools[recomendedPool]?.min}</h4>
                </div>

                <div className="stake-meta-div">
                  <p>MiniPool Rewards</p>
                  <span>Actual</span>
                  <h4 className="head">
                  {pools[recomendedPool]?.rewardTokenValue}<sub>HEST</sub>
                  </h4>
                </div>

                <div className="stake-meta-div">
                  <p>MiniPool Users joined</p>
                  <span>Actual</span>
                  <h4 className="head">{pools[recomendedPool]?.noOfusers}</h4>
                </div>

                <div className="stake-meta-div stake-green">
                  <p>Current Value</p>
                  <h4 className="head">HEST</h4>
                </div>

                <div className="stake-meta-div stake-green">
                  <p>Estimated Value</p>
                  <h4 className="head">USD</h4>
                </div>
              </div>

              <button className="input-stake w-100 border-none">
                <img src={Hest} />
                <p
                onClick={() => navigate(`/pool-detail/${recomendedPool}`,{state: { data: pools[recomendedPool], poolTitle : poolTitle[recomendedPool] , currentPool } })}
                >Join Pool</p>
                {/* <button
                onClick={() => navigate(`/pool-detail/${recomendedPool}`,{state: { data: pools[recomendedPool], poolTitle : poolTitle[recomendedPool] , currentPool } })}
                >Join Pool</button> */}
              </button>

              {/* <div className="btn-group justify-content-end">
                <button class="custom-btn secondary-btn">Unstake</button>
                <button class="custom-btn secondary-btn">Stake</button>
              </div> */}

              <div className="minipool-table">
                <p>MiniPool Current Detail</p>
                <Minipooltable />
              </div>
            </div>
          </Col>
        </Row>
        <CompoundModal {...compoundModalProps }/>
      </Container>
    </>
  );
}
export default Stake;
