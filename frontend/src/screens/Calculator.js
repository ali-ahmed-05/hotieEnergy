import { Col, Container, Row, Table, Form } from "react-bootstrap";
import Hest from "../assets/images/hest.png";
import Minipooltable from "../components/MiniPoolTable";

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

import { loadProvider } from "../utils/provider";
import ERROR from "../utils/error";

import moment from "moment";

function Calculator() {
  const [pools, setPools] = useState([]);
  const poolTitle = [
    "Adnvace 3",
    "Adnvace 2",
    "Adnvace 1",
    "Advantage 2",
    "Advantage 1",
    "Plus 2",
    "Plus 1",
    "Prestige",
  ];
  const [_amount, setAmount] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
  const [estimated_value, setEstimated_value] = useState([
    0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [currentPool, setcurrentPool] = useState();

  const [TotalRewardBalance, setTotalRewardBalance] = useState(0);
  const [TotalRewardClaimable, setTotalRewardClaimable] = useState(0);
  const [recomendedPool, setRecomendedPool] = useState(0);
  const [hestBalance, setHESTBalance] = useState(0);
  const [stakedBalance, setStakedBalance] = useState();
  const [toUSD, settoUSD] = useState();
  const [compoundModal, setCompoundModal] = useState(false);
  const [selectedPools, setSelectedPools] = useState([]);
  const [poolrewards, setpoolrewards] = useState(0);
  const [timeCount, setTimeCount] = useState('')

  const toggleModalState = () => setCompoundModal((prevState) => !prevState);

  console.log(selectedPools);

  const handleSelectPool = (index) => {
    if (selectedPools.includes(index)) {
      setSelectedPools((prevState) =>
        prevState.filter((pool) => pool !== index)
      );
    } else {
      setSelectedPools((prevState) => [...prevState, index]);
    }
    console.log(selectedPools);
  };

  const handleClubStake = () => {
    alert("Club Stake");
  };
  const changeEstimatedValue = (index, value) => {
    console.log("key", index, "value", value);
    const arr = [...estimated_value];
    arr[index] = value;

    setEstimated_value(arr);
  };

  const changeAmountValue = (index, event, min, max) => {
      const arr = [..._amount];
      arr[index] = Number(event.target.value);
      setAmount(arr);
  };

  const compoundModalProps = {
    poolTitle,
    status: compoundModal,
    handleClose: toggleModalState,
    handleSelectPool,
    TotalRewardBalance,
    hestBalance,
    stakedBalance,
    handleClubStake,
  };

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

  const valuetoRewardToken = async (amount, path, decimals) => {
    try {
      let signer = await loadProvider();
      let Routercontract = new ethers.Contract(router_addr, RouterABI, signer);
      let value = await Routercontract.getAmountsOut(amount, path);

      console.log("getAmountsOut", value);
      console.log("getAmountsOut", value[1].toString());

      value = Number(
        ethers.utils.formatUnits(value[1].toString(), decimals)
      ).toFixed(5);

      console.log("getAmountsOut", value);

      return value.toString();
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentPool = async () => {
    try {
      let signer = await loadProvider();
      let stakingContract = new ethers.Contract(staking_addr, ABI, signer);
    } catch (error) {
      console.log("getCurrentPool", error);
    }
  };

  const totalRewards = async (_currentPool, stakingContract, decimals) => {
    try {
      let temp = 0;
      let claim = 0;
      console.log("_currentPool", _currentPool);
      for (let index = 1; index <= _currentPool; index++) {
        for (let id = 1; id < 9; id++) {
          let totalRewardBlance = await stakingContract.totalReward(
            account,
            id,
            index,
            id
          );
          temp += Number(
            ethers.utils.formatUnits(totalRewardBlance.toString(), decimals)
          );
          console.log(
            "totalRewards",
            id,
            Number(
              ethers.utils.formatUnits(totalRewardBlance.toString(), decimals)
            )
          );
          if (index != _currentPool)
            claim += Number(
              ethers.utils.formatUnits(totalRewardBlance.toString(), decimals)
            );
        }
      }

      console.log("totalRewards", temp);

      setTotalRewardBalance(temp.toFixed(5));
      setTotalRewardClaimable(claim.toFixed(5));
    } catch (error) {
      console.log(error);
    }
  };

  const redeem = async () => {
    try {
      let signer = await loadProvider();
      let stakingContract = new ethers.Contract(staking_addr, ABI, signer);
      let clubsend = await stakingContract.clubRewards(account, true, []);
      await clubsend.wait();
    } catch (error) {
      ERROR.catch_error(error, "redeem");
    }
  };

  const poolDetail = async (signer) => {
    try {
      let stakingContract = new ethers.Contract(staking_addr, ABI, signer);
      let HestContract = new ethers.Contract(hestoken_addr, TokenABI, signer);
      let HestDecimals = await HestContract.decimals();
      let HestBalance = Number(
        ethers.utils.formatUnits(
          (await HestContract.balanceOf(account)).toString(),
          HestDecimals
        )
      );
      setHESTBalance(HestBalance);
      let rewardToken_address = await stakingContract.rewardToken();
      let rewardContract = new ethers.Contract(
        rewardToken_address,
        TokenABI,
        signer
      );

      let reward_decimals = await rewardContract.decimals();
      let _hesttemp_balance = ethers.utils.parseUnits(
        HestBalance.toString(),
        HestDecimals
      );
      let getAmountsOut = await valuetoRewardToken(
        _hesttemp_balance,
        [hestoken_addr, rewardToken_address],
        reward_decimals
      );

      settoUSD(getAmountsOut);

      let _currentPool = await stakingContract.currentPool();
      _currentPool = Number(_currentPool.toString());

      setcurrentPool(_currentPool);

      await totalRewards(_currentPool, stakingContract, reward_decimals);

      let pool = [];
      let poolreward = 0;

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

        poolreward += Number(pool[pool.length - 1].rewardTokenValue);

        if (HestBalance >= pool[pool.length - 1].min) {
          setRecomendedPool(pool.length - 1);
          console.log("setRecomendedPool", pool.length - 1);
        }
      }
      setpoolrewards(poolreward);

      setPools(pool);
      console.log(pool);
    } catch (error) {
      console.log(error);
    }
  };

  const checkvalue = (index , min , max)=>{
    min = Number(min)
    max = Number(max)
    let value = _amount[index]
    console.log("asdasdasd",value)
    if(value < min || value > max){
      ERROR.log(`please enter amount within range ${min} - ${max}`)
      return false
    }else{
      return true
    }
  }

  const calculate = async (index , min , max) => {
    try {
      let check = checkvalue(index , min , max)
      if(check){

      
      let signer = await loadProvider();
      let stakingContract = new ethers.Contract(staking_addr, ABI, signer);
      let HestContract = new ethers.Contract(hestoken_addr, TokenABI, signer);
      let HestDecimals = await HestContract.decimals();
      let rewardToken_address = await stakingContract.rewardToken();
      let rewardContract = new ethers.Contract(
        rewardToken_address,
        TokenABI,
        signer
      );

      let reward_decimals = await rewardContract.decimals();
      console.log(currentPool);
      let tx = await stakingContract.calculator(
        ethers.utils.parseUnits(_amount[index].toString(), HestDecimals),
        index + 1,
        currentPool
      );
      console.log("calculator", tx.toString(), estimated_value[index]);
      changeEstimatedValue(
        index,
        Number(ethers.utils.formatUnits(tx.toString(), reward_decimals)).toFixed(4)
      );
    }
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

  return (
    <>
      <Container fluid className="main-height">
        <Row>
          <Col xl={12} lg={12}>
            <div className="page-margin-top">
              <h5 className="section-title">
                CALCULATE YOUR ESTIMATED EARNINGS
              </h5>

              {/* <div className="calculator-parent mt-3">
                        
                        <p >%  SHARED EARNINGS</p>

                        {/* <div className="calculator"> */}

              {/* <Form>
                                <div className="calculator-group">
                                    <label>Introduce an amount that you consider Hotei’s may deposit</label>
                                    <div className="calculator-values">
                                        <input type="number"/>
                                        <span>USD</span>
                                    </div>
                                </div>

                                <div className="calculator-group">
                                    <label>Your estimated HEST balance</label>
                                    <div className="calculator-values">
                                        <input type="number"/>
                                        <span>HEST</span>
                                    </div>
                                </div>

                                <div className="calculator-group">
                                    <label>HEST approx. value</label>
                                    <div className="calculator-values">
                                        <input type="number"/>
                                        <span>USD / HEST</span>
                                    </div>
                                </div>
                            </Form> */}

              {/* <div className="calculator-meta">

                                <div className="calculator-ammount">
                                <p>Amount shared To support HEST</p>
                                <div>
                                    <span></span>
                                    <span className="position-absolute">USDT</span>
                                </div>

                                <div>
                                    <span>51%</span>
                                </div>
                                </div>

                                <div className="calculator-ammount">
                                <p>Amount shared To support HEST</p>
                                <div>
                                    <span></span>
                                    <span className="position-absolute">USDT</span>
                                </div>

                                <div>
                                    <span>51%</span>
                                </div>
                                </div>

                                <div className="calculator-ammount">
                                <p>Amount shared To support HEST</p>
                                <div>
                                    <span></span>
                                    <span className="position-absolute">USDT</span>
                                </div>

                                <div>
                                    <span>51%</span>
                                </div>

                                </div>

                              
                            </div> */}

              {/* </div> */}

              {/* </div>  */}
            </div>

            <div className="trade-section">
              <h5 class="section-title">ActiveMiniPools</h5>

              <div className="select-minipool">
                <div>
                  <p class="head mb-0">Select a MiniPool</p>
                  <p class="light-small-p">HEST Balance Required</p>
                </div>

                <div className="d-flex align-items-center">
                  <span className="border-bg">Total Reward</span>
                  <span className="border-bg">
                    {poolrewards} <sub>USDT</sub>
                  </span>
                  <div className="position-relative">
                    <p className="light-small-p absolute-p">
                      REMAINING TIME TO CLOSE
                    </p>
                    <span className="border-bg">{timeCount?.days !== undefined  ? timeCount?.months > 0 ?  30*timeCount?.months: timeCount?.days : 0} : {timeCount?.hours !== undefined ? timeCount?.hours :"00"} : {timeCount?.minutes !== undefined ? timeCount?.minutes :"00"} : {timeCount?.seconds !== undefined ? timeCount?.seconds :"00"}</span>
                  </div>
                </div>
              </div>

              <Form className="minipool-form">
                {pools.map((value, key) => {
                  return (
                    <>
                      <div className="minipool-check">
                        <div class="form-check">
                          <label class="form-check-label" for="check1">
                            {poolTitle[key]}
                            <span>
                              {value.min} - {value.max}
                            </span>
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
                          <span className="border-bg d-flex">
                            {value.max} <sub>HEST</sub>
                          </span>
                        </div>
                        <div className="with-label">
                          <label for="" className="custom-label-new">Input Hest</label>
                          <span className="border-bg d-flex-input">
                            <input
                              type="number"
                              max={value.max}
                              min={value.min}
                              value={_amount[key]}
                              placeholder={"enter amount"}
                              onChange={(e) =>
                                changeAmountValue(key, e, value.min, value.max)
                              }
                              className="input-none-style"
                            />{" "}
                            <sub>HEST</sub>
                          </span>
                        </div>
                        <div className="with-label">
                          <label for="" className="custom-label-new">Output Amount</label>
                          <span className="border-bg d-flex">
                            {estimated_value[key]} <sub>USD</sub>
                          </span>
                        </div>
                        <div className="with-label">
                          <label for="" className="custom-label-new text-white"></label>
                          <button
                            type="button"
                            class="custom-btn secondary-btn d-flex"
                            onClick={() => calculate(key,value.min,value.max)}
                          >
                            Calculate
                          </button>
                        </div>
                        </div>
                      </div>
                    </>
                  );
                })}
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}
export default Calculator;
