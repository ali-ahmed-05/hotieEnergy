import { Col, Container, Row,Table, Form } from "react-bootstrap";
import Hest from '../assets/images/hest.png'
import Minipooltable from "../components/MiniPoolTable";
import whitepaper from '../assets/WHITEPAPER.pdf';
import { useNavigate } from "react-router-dom";


function Stake(){
    const navigate = useNavigate();
    return <>
            <Container fluid className="main-height">

                <Row>

                    <Col xl={8} lg={12}>

                        <div className="page-margin-top">

                        <div className="how-it-work">
                            <h5 className="section-title">YOUR BALANCE</h5>
                            <a href='#' target='_blank' className='custom-btn secondary-btn' onClick={() => window.open(whitepaper)}>How it works</a>
                        </div>

                            <p className="pt-4">Balance of 0x0f7809</p>

                            <div className="stake-top">

                                <div>
                                    <div className="wallet-blnc">

                                        <div className="text-center">
                                            <p className="light-p">Wallet Balance:</p>
                                            <div className="hest-to-usd">
                                                <span>1 HEST</span>
                                                <span>~</span>
                                                <span>0.085 USD</span>
                                            </div>

                                            <button class="custom-btn secondary-btn">Stake</button>

                                        </div>

                                        <div className="text-center">
                                            <p className="light-p">Wallet Balance:</p>
                                            <div className="hest-to-usd">
                                                <span>1 HEST</span>
                                                <span>~</span>
                                                <span>0.085 USD</span>
                                            </div>

                                            <button class="custom-btn secondary-btn">Unstake</button>

                                        </div>
                                        <div className="text-center">
                                            <p className="light-p">Total Reward Balance:</p>
                                            <div className="hest-to-usd py-2">
                                                <span>300</span>
                                                <span>USD</span>
                                            </div>

                                        <div className="d-flex flex-column">
                                
                                            <button class="custom-btn secondary-btn mb-3">Compound</button>
                                            <button class="custom-btn secondary-btn">Redeem</button>

                                        </div>

                                        </div>
                                    </div>

                                    {/* <div className="wallet-blnc">

                                         <div className="text-center">
                                            <p className="bold-p">Recommended MiniPools:</p>
                                        
                                        <div className="advance-pool">
                                            <p className="light-small-p">Advance 2</p>
                                            <div className="hest-to-usd">
                                                <span>2,500 - 5,000</span>
                                                <button class="small-btn">Join</button>
                                            </div>
                                        </div>

                                        <div className="advance-pool">
                                            <p className="light-small-p">Advance 2</p>
                                            <div className="hest-to-usd">
                                                <span>2,500 - 5,000</span>
                                                <button class="small-btn">Join</button>
                                            </div>
                                        </div>

                                        </div> 

                                         <div className="text-center">
                                            <p className="light-p">Total Reward Balance:</p>
                                            <div className="hest-to-usd py-2">
                                                <span>300</span>
                                                <span>USD</span>
                                            </div>

                                        <div className="d-flex flex-column">
                                
                                            <button class="custom-btn secondary-btn mb-3">Compound</button>
                                            <button class="custom-btn secondary-btn">Redeem</button>

                                        </div>

                                        </div> 

                                    </div> */}
                                </div>

                                {/* <div className="trade-section">

                                    <p class="light-p">MiniPool (s) Active:</p>
                                    <p class="light-small-p">Advance 2</p>

                                    <ul className="active-minipool">
                                        <li>
                                            <span>STAKE BALANCE (HEST)</span>
                                            <h3 className="head">150</h3>
                                        </li>

                                        <li>
                                            <span>ACTUAL USERS</span>
                                            <h3 className="head">23</h3>
                                        </li>

                                        <li>
                                            <span>MiniPool (USDT)</span>
                                            <h3 className="head">2950</h3>
                                        </li>

                                        <li>
                                            <span>REDEEM YOUR CLAIMABLE BALANCE(USDT)</span>
                                            <h3 className="head">30</h3>
                                        </li>
                                    </ul>

                                    <div className="time-remain-minipool">
                                        <p class="light-p">Remaining Time to Close</p>
                                        <h3 className="head">00 : 00 : 00 : 00</h3>
                                        <div class="btn-group">
                                            <button class="custom-btn secondary-btn">Unstake</button>
                                            <button class="custom-btn secondary-btn">Stake</button>
                                        </div>
                                    </div>

                                </div> */}

                            </div>

                        </div>

                        <div className="trade-section">

                            <div className="select-month-main"> 
                            <h5 class="section-title">Stake - MiniPools</h5>
                            <div className="position-relative">
                            {/* <p className="light-small-p ">Select Month</p> */}
                                <select className="form-control" style={{width:'200px'}}>
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
                                    <span className="border-bg">58,500 <sub>USDT</sub></span>
                                    <div className="position-relative">
                                        <p className="light-small-p absolute-p">REMAINING TIME TO CLOSE</p>
                                        <span className="border-bg">00 : 00 : 00 : 00</span>
                                    </div>
                                 
                                </div>
                                
                            </div>
                           
                            <Form className="minipool-form">

                           
                            <div className="minipool-check">
                                
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="check1"/>
                                    <label class="form-check-label" for="check1">
                                        Prestige
                                        <span>176,000 - above</span>
                                    </label>
                                </div>
                                
                                <div className="form-check-basis">
                                    <span className="border-bg">25</span>
                                    <span className="border-bg">14,625 <sub>USDT</sub></span>
                                    <span className="border-bg">4</span>
                                    <button class="custom-btn secondary-btn" onClick={()=>navigate('/pool-detail/1')}>Join</button>

                                </div>
                            </div>

                            <div className="minipool-check">
                                
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="check1"/>
                                    <label class="form-check-label" for="check1">
                                        Prestige
                                        <span>176,000 - above</span>
                                    </label>
                                </div>
                                
                                <div className="form-check-basis">
                                    <span className="border-bg">25</span>
                                    <span className="border-bg">14,625 <sub>USDT</sub></span>
                                    <span className="border-bg">4</span>
                                    <button class="custom-btn secondary-btn">Join</button>

                                </div>
                            </div>

                            <div className="minipool-check">
                                
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="check1"/>
                                    <label class="form-check-label" for="check1">
                                        Prestige
                                        <span>176,000 - above</span>
                                    </label>
                                </div>
                                
                                <div className="form-check-basis">
                                    <span className="border-bg">25</span>
                                    <span className="border-bg">14,625 <sub>USDT</sub></span>
                                    <span className="border-bg">4</span>
                                    <button class="custom-btn secondary-btn">Join</button>

                                </div>
                            </div>

                            <div className="minipool-check">
                                
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="check1"/>
                                    <label class="form-check-label" for="check1">
                                        Prestige
                                        <span>176,000 - above</span>
                                    </label>
                                </div>
                                
                                <div className="form-check-basis">
                                    <span className="border-bg">25</span>
                                    <span className="border-bg">14,625 <sub>USDT</sub></span>
                                    <span className="border-bg">4</span>
                                    <button class="custom-btn secondary-btn">Join</button>

                                </div>
                            </div>

                            <div className="minipool-check">
                                
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="check1"/>
                                    <label class="form-check-label" for="check1">
                                        Prestige
                                        <span>176,000 - above</span>
                                    </label>
                                </div>
                                
                                <div className="form-check-basis">
                                    <span className="border-bg">25</span>
                                    <span className="border-bg">14,625 <sub>USDT</sub></span>
                                    <span className="border-bg">4</span>
                                    <button class="custom-btn secondary-btn">Join</button>

                                </div>
                            </div>

                            <div className="minipool-check">
                                
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="check1"/>
                                    <label class="form-check-label" for="check1">
                                        Prestige
                                        <span>176,000 - above</span>
                                    </label>
                                </div>
                                
                                <div className="form-check-basis">
                                    <span className="border-bg">25</span>
                                    <span className="border-bg">14,625 <sub>USDT</sub></span>
                                    <span className="border-bg">4</span>
                                    <button class="custom-btn secondary-btn">Join</button>

                                </div>
                            </div>


                            <div className="minipool-check">
                                
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="check1"/>
                                    <label class="form-check-label" for="check1">
                                        Prestige
                                        <span>176,000 - above</span>
                                    </label>
                                </div>
                                
                                <div className="form-check-basis">
                                    <span className="border-bg">25</span>
                                    <span className="border-bg">14,625 <sub>USDT</sub></span>
                                    <span className="border-bg">4</span>
                                    <button class="custom-btn secondary-btn">Join</button>

                                </div>
                            </div>

                            <div className="minipool-check">
                                
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="check1"/>
                                    <label class="form-check-label" for="check1">
                                        Prestige
                                        <span>176,000 - above</span>
                                    </label>
                                </div>
                                
                                <div className="form-check-basis">
                                    <span className="border-bg">25</span>
                                    <span className="border-bg">14,625 <sub>USDT</sub></span>
                                    <span className="border-bg">4</span>
                                    <button class="custom-btn secondary-btn">Join</button>

                                </div>
                            </div>

                            <div className="minipool-check">
                                
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="check1"/>
                                    <label class="form-check-label" for="check1">
                                        Prestige
                                        <span>176,000 - above</span>
                                    </label>
                                </div>
                                
                                <div className="form-check-basis">
                                    <span className="border-bg">25</span>
                                    <span className="border-bg">14,625 <sub>USDT</sub></span>
                                    <span className="border-bg">4</span>
                                    <button class="custom-btn secondary-btn">Join</button>

                                </div>
                            </div>

                            
                                
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


                        <div className="input-stake">

                            <img src={Hest}/>
                            <p>Input Amount to Stake</p>

                        </div>

                        <div className="btn-group justify-content-end">
                        <button class="custom-btn secondary-btn">Unstake</button>
                        <button class="custom-btn secondary-btn">Stake</button>
                        </div>

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
export default Stake;