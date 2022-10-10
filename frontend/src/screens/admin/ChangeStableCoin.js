import { Col, Container, Row,Table, Form } from "react-bootstrap";
import Hest from '../../assets/images/hest.png'


import { memo, useEffect, useState } from "react";
import {staking_addr} from '../../contract/addresses'
import ABI from '../../contract/Staking.json'
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import Web3Modal from 'web3modal'
import {loadProvider} from '../../utils/provider'
import ERROR from '../../utils/error'
import IERC20Metadata from "../../contract/IERC20Metadata.json";
import IERC20 from "../../contract/HESTOKEN.json";


function ChangeStableCoin(){

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

    const [address , setAddress] = useState('')
    const [token , setToken] = useState('')
    const [symbol , setSymbol] = useState('')
    const [name , setName] = useState('')
    const [balance , setBalance] = useState('')

    const getToken = async () => {
        
    try {
            let signer = await loadProvider()
            let contract = new ethers.Contract(staking_addr, ABI, signer);
            let rewardToken_address = await contract.rewardToken();
            let rewardContract = new ethers.Contract(
                rewardToken_address,
                IERC20Metadata,
                signer
            );
            let _symbol = await rewardContract.symbol();
            let _name = await rewardContract.name();
            let _balance = await rewardContract.balanceOf(staking_addr)
            setBalance(_balance.toString())
            setSymbol(_symbol)
            setName(_name)
            setToken(rewardToken_address)

    } catch (error) {
        ERROR.catch_error(error, 'change')
        }
    }

    const change = async (e) => {
        e.preventDefault()
    try {
            let signer = await loadProvider()
            let rewardContract = new ethers.Contract(
                token,
                IERC20,
                signer
            );
            let allowance = await rewardContract.approve(staking_addr , balance)
            let tx = await allowance.wait()
            if(tx.confirmations > 0){
                let contract = new ethers.Contract(staking_addr, ABI, signer);
                let _chnageToken = await contract.setRewardTokenAddress(address)
                await _chnageToken.wait()
            }

    } catch (error) {
        ERROR.catch_error(error, 'change')
        }
    }

    useEffect(async ()=>{
        if(account){
            await getToken()
        }
    }
    ,[account])


    return <>
            <Container fluid className="main-height">

                <Row>

                    <Col xl={12} lg={12}>

                        <div className="page-margin-top">

                        <div className="how-it-work">
                            <h5 className="section-title">STABLE COIN</h5>
                        </div>


                            <div className="stake-top stable-coin-page">

                                <Row>
                                    <Col lg={8}>
                                    <div className="wallet-blnc">

                                        <div className="stable-coin">
                                            <p className=""><img src={Hest} className="icon" width="50"/></p>
                                            <div>
                                            <p className="light-p">Address :</p>
                                            <p className="">{token}</p>
                                            </div>
                                            <div>
                                            <p className="light-p">Name :</p>
                                            <p className="">{name}</p>
                                            </div>
                                            <div>
                                            <p className="light-p">Symbol :</p>
                                            <p className="">{symbol}</p>
                                            </div>
                                            <div>
                                            </div>
                                        </div>

                                        </div>
                                    </Col>
                                    
                                    <Col lg={6}>

                                    <div className="wallet-blnc">
                                        
                                        <div className="advance-pool stable-input-box ">
                                            <h5 className="section-title">Change Coin</h5>
                                            <div className="hest-to-usd">

                                            <input className="form-control" onChange={(e)=>setAddress(e.target.value)}/>
                                                <button class="small-btn" onClick={(e)=>change(e)}>Submit</button>
                                            </div>

                                        </div>
                                    </div>

                                    </Col>
                                    
                                </Row>
                            </div>

                        </div>
                        
                    </Col>


                </Row>
            </Container>
    </>
}
export default ChangeStableCoin;