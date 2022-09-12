import { Col, Container, Row,Table, Form } from "react-bootstrap";
import Hest from '../assets/images/hest.png'
import Minipooltable from "../components/MiniPoolTable";
import whitepaper from '../assets/WHITEPAPER.pdf';


function PoolDetail(){
    return <>
            <Container fluid className="main-height">

                <Row>
                    <Col xl={6} lg={12}>

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
                            <h4 className="head">Advance 3</h4>
                        </div>

                        <div className="stake-meta-div">
                            <p>MiniPool %</p>
                            <h4 className="head">5%</h4>
                        </div>

                        <div className="stake-meta-div">
                            <p>MiniPool Rewards</p>
                            <h4 className="head">295<sub>USD</sub></h4>
                        </div>

                        <div className="stake-meta-div">
                            <p>MiniPool Users joined</p>
                            <span>Actual</span>
                            <h4 className="head">525</h4>
                        </div>

                        <div className="stake-meta-div">
                            <p>MiniPool Rewards</p>
                            <span>Actual</span>
                            <h4 className="head">408<sub>HEST</sub></h4>
                        </div>

                        <div className="stake-meta-div">
                            <p>MiniPool Users joined</p>
                            <span>Actual</span>
                            <h4 className="head">0.29</h4>
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
                            <input className="form-control" placeholder="Input Amount to Stake"/>

                        {/* </div> */}

                        <div className="btn-group justify-content-end">
                        <button class="custom-btn secondary-btn">Unstake</button>
                        <button class="custom-btn secondary-btn">Stake</button>
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