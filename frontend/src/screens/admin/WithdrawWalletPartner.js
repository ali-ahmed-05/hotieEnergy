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


function WithdrawWalletPartner(){

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
    const [partner , setPartner] = useState('')


    const getPartner = async () => {
        
        try {
                let signer = await loadProvider()
                let contract = new ethers.Contract(staking_addr, ABI, signer);
                let _partner = await contract.partner()
                setPartner(_partner)
    
        } catch (error) {
            ERROR.catch_error(error, 'change')
            }
        }
    
        const change = async (e) => {
            e.preventDefault()
        try {
                let signer = await loadProvider()
                let contract = new ethers.Contract(staking_addr, ABI, signer);
                let transferPartnership = await contract.setPartnerAddress(address)
                await transferPartnership.wait()
    
        } catch (error) {
            ERROR.catch_error(error, 'change')
            }
        }
    
        useEffect(async ()=>{
            if(account){
                await getPartner()
            }
        }
        ,[account])

    return <>
            <Container fluid className="main-height">

                <Row>

                    <Col xl={12} lg={12}>

                        <div className="page-margin-top">

                        <div className="how-it-work">
                            <h5 className="section-title">WITHDRAW WALLET (PARTNER)</h5>
                        </div>


                            <div className="stake-top stable-coin-page">

                                <Row>
                                    <Col lg={8}>
                                    <div className="wallet-blnc">

                                        <div className="stable-coin">
                                            <p className=""><img src={Hest} className="icon" width="50"/></p>
                                            <div>
                                            <p className="light-p">Curren Partner Address :</p>
                                            <p className="">{partner}</p>
                                            </div>
                                            
                                            <div>
                                            </div>
                                        </div>

                                        </div>
                                    </Col>
                                    
                                    <Col lg={8}>

                                    <div className="wallet-blnc">
                                        
                                        <div className="advance-pool stable-input-box ">
                                            <h5 className="section-title">Change Owner</h5>
                                            <div className="hest-to-usd">

                                            <input className="form-control" onChange={(e)=>setAddress(e.target.value)} />
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
export default WithdrawWalletPartner;