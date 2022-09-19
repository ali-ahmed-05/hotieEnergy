import {Button, Col, Form, Modal, Row} from "react-bootstrap";
import ABI from "../../contract/Staking.json"; // ../contract/Staking.json
import TokenABI from "../../contract/HESTOKEN.json";
import RouterABI from "../../contract/IUniswapV2Router02.json";
import IERC20Metadata from "../../contract/IERC20Metadata.json";
import { memo, useEffect, useState } from "react";
import {
    staking_addr,
    hestoken_addr,
    router_addr,
  } from "../../contract/addresses";

import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { loadProvider } from '../../utils/provider';
import ERROR from "../../utils/error";

const CompoundModal = ({
                           status = false,
                           poolTitle = [],
                           handleClose,
                           hestBalance,
                           stakedBalance,
                           handleClubStake,
                           handleSelectPool,
                           TotalRewardBalance
                       }) => {

    const [indexes , setIndexes] = useState([])
    const [Total_Stake_Balance , setTotal_Stake_Balance] = useState(0)
    const [Estimate_HEST_Balance , setEstimate_HEST_Balance] = useState(0)

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

    const Compound = async () => {
        try {
          if(indexes.length != 0){
            let signer = await loadProvider();
            let stakingContract = new ethers.Contract(staking_addr, ABI, signer);
            let _compound = await stakingContract.clubRewards(account , false , indexes)
            await _compound.wait()
          }else{
            ERROR.log("select minipools")
          }
         
        } catch (error) {
            ERROR.catch_error(error,'Compound')
        }
      };

      const valuetoRewardToken = async (amount , path , decimals) => {
        try {
            let signer = await loadProvider()
            let Routercontract = new ethers.Contract(router_addr, RouterABI, signer);
            console.log("getAmountsOut com" , amount)

            let value = await Routercontract.getAmountsOut(amount,path)
    
            console.log("getAmountsOut com" , value)
            console.log("getAmountsOut com" , value[1].toString())
            
    
            value = Number(ethers.utils.formatUnits(value[1].toString(),decimals)).toFixed(5)
    
            console.log("getAmountsOut com" , value)
    
            return value.toString()
    
        } catch (error) {
            console.log("getAmountsOut com",error)
            return 0
        }
    }

    
    const handleCheck = (event , value) => {
        var updatedList = [...indexes];
        if (event.target.checked) {
          updatedList = [...indexes, value];
          updatedList.sort(function(a, b){return a - b})
        } else {
          updatedList.splice(indexes.indexOf(value), 1);
          updatedList.sort(function(a, b){return a - b})
        }
        setIndexes(updatedList);
        console.log(updatedList)
      };

    const close = ()=>{
        setIndexes((prevState) => {
            prevState = []
            return prevState
            })

        handleClose()
    }

    const userDetail = async () => {
        try {
            let signer = await loadProvider();
            let stakingContract = new ethers.Contract(staking_addr, ABI, signer);
            let rewardToken_address = await stakingContract.rewardToken();
            let rewardContract = new ethers.Contract(rewardToken_address, TokenABI, signer);
            let hest_contract = new ethers.Contract(hestoken_addr ,TokenABI , signer );
            let decimals = await hest_contract.decimals() 
            let reward_decimals = await rewardContract.decimals()
            let currentPool = await stakingContract.currentPool()
            currentPool = Number(currentPool.toString())
            let userTotalStaked = 0
            let userTotalClaimable = 0
            for (let index = 1; index < currentPool; index++) {
                
                for (let inn = 1; inn < 9; inn++) {
                    let stakeInfo = await stakingContract.stakeInfo(account,inn,index)
                    let totalReward = await stakingContract.totalReward(account , inn , index , inn)
                    userTotalStaked += Number(ethers.utils.formatUnits(stakeInfo[0].toString(),decimals))
                    userTotalClaimable += Number(ethers.utils.formatUnits(totalReward.toString(),reward_decimals)) 
                    console.log(ethers.utils.formatUnits(stakeInfo[0].toString(),decimals))   
                }
            }

            setTotal_Stake_Balance(userTotalStaked.toString())
            console.log("getAmountsOut com" , TotalRewardBalance.toString())
            
            setEstimate_HEST_Balance(await valuetoRewardToken(ethers.utils.parseUnits(TotalRewardBalance.toString() , reward_decimals) , [rewardToken_address , hestoken_addr] , decimals))
            
            //_hesttemp_balance , [hestoken_addr , rewardToken_address],reward_decimals
      
           
         //return {userTotalStaked : userTotalStaked.toString() , userTotalClaimable : userTotalClaimable.toString() , reward_decimals }
        } catch (error) {
            console.log(error)
        }
      }

      useEffect(async () => {
        if(account){
            await userDetail();
        }
      }, [account,TotalRewardBalance]);

    return (
        <Modal show={status} onHide={handleClose} size='lg'>
            <Modal.Header closeButton>
                <Modal.Title>Compound</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col>
                        <h6 className='text-center'>Hest available for Compound</h6>
                        <p className='text-center'> {Total_Stake_Balance} </p>
                    </Col>
                    <Col>
                        <h6 className='text-center'>Total Reward Balance</h6>
                        <p className='text-center'> {TotalRewardBalance} </p>
                    </Col>
                    <Col>
                        <h6 className='text-center'>Estimate HEST Balance</h6>
                        <p className='text-center'> {Number(Estimate_HEST_Balance) + Number(Total_Stake_Balance)} </p>
                    </Col>
                </Row>
                <hr/>
                <Row>
                    <Col>
                        <Form>
                            <Row>
                                {poolTitle.map((title, indx) => (
                                    <Col xs={4}>
                                        <Form.Group className="mb-3"
                                                    controlId="formBasicCheckbox custom-control custom-checkbox"
                                                    key={indx}>
                                            <Form.Check className='class="custom-control-input custom' type="checkbox"
                                                        label={title} onChange={(e) => handleCheck(e,indx + 1)}
                                            />
                                        </Form.Group>
                                    </Col>
                                ))}
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="custom-btn secondary-btn" onClick={Compound}>Club Stake</Button>
                <Button variant="secondary" onClick={close}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
};


export default CompoundModal;