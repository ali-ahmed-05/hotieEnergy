import { Col, Container, Row,Table, Form } from "react-bootstrap";
import Hest from '../../assets/images/hest.png'


function ChangeStableCoin(){
    return <>
            <Container fluid className="main-height">

                <Row>

                    <Col xl={12} lg={12}>

                        <div className="page-margin-top">

                        <div className="how-it-work">
                            <h5 className="section-title">STABLE COIN</h5>
                        </div>

                            <p className="pt-4">Total ~ 7809</p>

                            <div className="stake-top stable-coin-page">

                                <Row>
                                    <Col lg={4}>
                                    <div className="wallet-blnc">

                                        <div className="stable-coin">
                                            <p className=""><img src={Hest} className="icon" width="50"/></p>
                                            <div>
                                            <p className="light-p">Address :</p>
                                            <p className="">0x00000000</p>
                                            </div>
                                            <div>
                                            <p className="light-p">Name :</p>
                                            <p className="">Test</p>
                                            </div>
                                            <div>
                                            <p className="light-p">Symbol :</p>
                                            <p className="">$</p>
                                            </div>
                                            <div>
                                            </div>
                                        </div>

                                        </div>
                                    </Col>
                                    
                                    <Col lg={4}>

                                    <div className="wallet-blnc">
                                        
                                        <div className="advance-pool stable-input-box ">
                                            <h5 className="section-title">Change Coin</h5>
                                            <div className="hest-to-usd">

                                            <input className="form-control"/>
                                                <button class="small-btn">Submit</button>
                                            </div>

                                        </div>
                                    </div>

                                    </Col>
                                    <Col lg={4}>

                                        <div className="wallet-blnc">
                                            
                                            <div className="advance-pool stable-input-box ">
                                                <h5 className="section-title">Add Supply</h5>
                                                <div className="hest-to-usd">

                                                <input className="form-control"/>
                                                    <button class="small-btn">Submit</button>
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