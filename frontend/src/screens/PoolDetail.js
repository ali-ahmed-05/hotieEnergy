import { Col, Container, Row,Table, Form } from "react-bootstrap";
import Hest from '../assets/images/hest.png'
import Minipooltable from "../components/MiniPoolTable";
import whitepaper from '../assets/WHITEPAPER.pdf';
import {useLocation  , useParams} from 'react-router-dom';

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

import { loadProvider } from '../utils/provider'
import apis from "../services/apis";


import ERROR from '../utils/error'



function PoolDetail(){
    const location = useLocation();
    const detail = location.state
    const {id} = useParams()
    const ID = Number(id) + 1

    console.log(detail)
    console.log(ID)

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

    const [amount , setAmount] = useState()
    const [rewards , setRewards] = useState('0.0')
    const [staked , setStaked] = useState('0.0')
    const [update , setUpdate] = useState(0)


    const mineNBlocks =  async (n)=> {
        const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
        for (let index = 0; index < n; index++) {
            console.log("evm_mine")

            await provider.send("evm_mine")
        }
      }

    const stake = async ()=> {
        try {

            let min = Number(detail?.data.min)
            let max = Number(detail?.data.max)

            console.log("&&&&&&",min)
            console.log("&&&&&&&&",max)
            console.log("&&&&amount",Number(amount) + Number(staked))
            //timeRequirement()
            let _amount = Number(amount) + Number(staked)
            let signer = await loadProvider();
            let stakingContract = new ethers.Contract(staking_addr, ABI, signer);
            let condition = await stakingContract.timeRequirement()

            
            if(_amount >= min && _amount <= max && condition==true){

            console.log("&&&&&&",min)
            console.log("&&&&&&&&",max)

            

            
            let HestContract = new ethers.Contract(hestoken_addr, TokenABI, signer);
            let HestDecimals = await HestContract.decimals();

            

            let approve = await HestContract.approve(staking_addr , ethers.utils.parseUnits(amount.toString() , HestDecimals))
            let tx = await approve.wait()
            if(tx.confirmations > 0){
                let add = await stakingContract.stake(ID)
                await add.wait()
                await apis.createPoolAddress({ id: ID, number: 1, address: account, balance: amount.toString() })

                setUpdate(update+1)
                //localHost testing lines
            //    await mineNBlocks(24 * 15)
            }

            }else{
                console.log("asdasdsad")
                if(condition==false)
                ERROR.log("Pool has been closed")
                else
                ERROR.log("please enter amount between mininum and maximum")
                
            }
    
        } catch (error) {
            ERROR.catch_error(error,'stake')
        }
    }


    const unstake = async ()=> {
        try {

            let signer = await loadProvider();
            let stakingContract = new ethers.Contract(staking_addr, ABI, signer);
            let HestContract = new ethers.Contract(hestoken_addr, TokenABI, signer);
            let HestDecimals = await HestContract.decimals();

            let _unstake  = await stakingContract.unStake(ID , detail?.currentPool , ethers.utils.parseUnits(amount.toString() , HestDecimals))
            await _unstake.wait()

            setUpdate(update+1)
    
        } catch (error) {
            ERROR.catch_error(error,'unstake')
        }
      }
    


    const userDetail = async (signer , decimals , rewardToken_address ) => {
        try {

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
            
            let stakeInfo = await stakingContract.stakeInfo(account,ID,detail?.currentPool)
            let totalReward = await stakingContract.totalReward(account , ID , detail?.currentPool , ID)
            let userTotalStaked = ethers.utils.formatUnits(stakeInfo[0].toString(),HestDecimals)
            let userTotalClaimable = ethers.utils.formatUnits(totalReward.toString(),reward_decimals)
            setRewards(userTotalClaimable)
            setStaked(userTotalStaked)
           
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(
        async ()=>{
            if(ID!==0 && library){
                await userDetail()
                //await mineNBlocks(1)
            }
        }
    ,[account , library , update])

    return <>
            <Container fluid className="main-height">

                <Row>
                    <Col xl={6} lg={12}>

                    <div className="trade-section">

                        <p className="head">Selected MiniPool</p>
                        
                        

                        <div className="stake-meta">

                        <div className="stake-meta-div">
                            <p>MiniPool Selected</p>
                            <h4 className="head">{detail?.poolTitle}</h4>
                        </div>

                        <div className="stake-meta-div">
                            <p>MiniPool %</p>
                            <h4 className="head">{detail?.data.cent}</h4>
                        </div>

                        <div className="stake-meta-div">
                            <p>MiniPool Minimum Holding</p>
                            <h4 className="head">{detail?.data.min}<sub>HEST</sub></h4>
                        </div>

                        <div className="stake-meta-div">
                            <p>MiniPool Maximum Holding</p>
                            <span>Actual</span>
                            <h4 className="head">{detail?.data.max}<sub>HEST</sub></h4>
                        </div>

                        <div className="stake-meta-div">
                            <p>MiniPool Rewards</p>
                            <span>Actual</span>
                            <h4 className="head">{detail?.data.rewardTokenValue}<sub>USD</sub></h4>
                        </div>

                        <div className="stake-meta-div">
                            <p>MiniPool Users joined</p>
                            <span>Actual</span>
                            <h4 className="head">{detail?.data.noOfusers}</h4>
                        </div>

                        <div className="stake-meta-div">
                            <p>Users HEST staked</p>
                            <span>Actual</span>
                            <h4 className="head">{staked}<sub>HEST</sub></h4>
                        </div>

                        <div className="stake-meta-div">
                            <p>Users rewards</p>
                            <span>Actual</span>
                            <h4 className="head">{rewards}<sub>USD</sub></h4>
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


                        {/* <div className="input-stake"> */}

                             {/* <img src={Hest}/> */}
                            <p>Input Amount to Stake</p> 
                            <input className="form-control" placeholder="Input Amount to Stake" onChange={(e)=> setAmount(e.target.value)}/>

                        {/* </div> */}

                        <div className="btn-group justify-content-end">
                        
                        <button class="custom-btn secondary-btn" onClick={stake}>Stake</button>
                        <button class="custom-btn secondary-btn" onClick={unstake}>Unstake</button>
                       
                        </div>

                    </div>

                   

                    </Col>
                    <Col xl={6} lg={12}>
                    <div className="trade-section">

                    <div className="minipool-table">
                            <p>MiniPool Current Detail</p>
                            <Minipooltable/>
                        </div>
                        </div>
                    </Col>
                </Row>
            </Container>
    </>
}
export default PoolDetail;