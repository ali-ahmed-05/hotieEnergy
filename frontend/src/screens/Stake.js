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

function Stake() {
  const [pools, setPools] = useState([]);
  const poolTitle = ["Adnvace 3","Adnvace 2","Adnvace 1", "Advantage 2" , "Advantage 1" ,"Plus 2" ,"Plus 1","Prestige"]
  const [currentPool, setcurrentPool] = useState();
  const [TotalRewardBalance , setTotalRewardBalance] = useState(0)
  const [recomendedPool , setRecomendedPool] = useState(0)
  const [hestBalance , setHESTBalance] = useState(0) 
  const [toUSD , settoUSD] = useState() 

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

  const loadProvider = async () => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      return provider.getSigner();
    } catch (e) {
      console.log("loadProvider: ", e);
    }
  };

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
        for (let index = 1; index <= _currentPool; index++) {
            for (let id = 1; id < 9; id++) {
                let totalRewardBlance  = await stakingContract.totalReward(account,id,_currentPool,_currentPool)
                temp += Number( ethers.utils.parseUnits(totalRewardBlance.toString(), decimals))     
            }
        }
        console.log("totalRewards",temp)
        setTotalRewardBalance(temp)
        
    } catch (error) {
        console.log(error)
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

      await totalRewards(_currentPool,stakingContract,HestDecimals)

      let pool = [];

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

        if(HestBalance >= pool[pool.length-1].min){
          setRecomendedPool(pool.length-1)
          console.log("setRecomendedPool",pool.length-1)
        }

        
      }
      setPools(pool);
      console.log(pool);
    } catch (error) {
      console.log(error);
    }
  };

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

              <div className="stake-top">
                <div>
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
                      <p className="light-p">Total Reward Balance:</p>
                      <div className="hest-to-usd py-2">
                        <span>{TotalRewardBalance}</span>
                        <span>USD</span>
                      </div>

                      <div className="d-flex flex-column">
                        <button class="custom-btn secondary-btn mb-3">
                          Compound
                        </button>
                        <button class="custom-btn secondary-btn">Redeem</button>
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
                  <select className="form-control" style={{ width: "200px" }}>
                    <option value="">This Month</option>
                    <option value="">Last Month</option>
                  </select>
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
                    58,500 <sub>USDT</sub>
                  </span>
                  <div className="position-relative">
                    <p className="light-small-p absolute-p">
                      REMAINING TIME TO CLOSE
                    </p>
                    <span className="border-bg">00 : 00 : 00 : 00</span>
                  </div>
                </div>
              </div>

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
                      <span className="border-bg">{value.cent}%</span>
                      <span className="border-bg">
                      {value.min} <sub>HEST</sub>
                      </span>
                      <span className="border-bg">{value.max} <sub>HEST</sub></span>
                      <button
                        class="custom-btn secondary-btn"
                        onClick={() => navigate(`/pool-detail/${key}`,{state: { data: value, poolTitle : poolTitle[key] , currentPool } })}
                      >
                        Join
                      </button>
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

              <div className="time-refresh">
                <p>ESTIMATED TIME TO REFRESH</p>
                <div className="stake-time">
                  <span>MIN &nbsp; SEC</span>
                  <span>00 : 00</span>
                </div>
              </div>

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
      </Container>
    </>
  );
}
export default Stake;
