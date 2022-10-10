import { Col, Container, Row } from "react-bootstrap";
import Transfer from '../assets/images/transfer.png'
import BuySell from '../assets/images/buy-sell.png'
import Wallet from '../assets/images/wallet.png'
import WalletPartner from '../assets/images/wallet-partner.png'
import Amount from '../assets/images/amount.png'
import Dollar from '../assets/images/dollar.png'
import MakePayment from '../assets/images/make-payment.png'
import Calender from '../assets/images/calender.png'
import Pool from '../assets/images/pool.png'
import News from '../assets/images/new2.png'
import Info from '../assets/images/info.png'


import { HistoricGraph } from '../components/Index';
import { Link } from "react-router-dom";

function Admin() {
    return <>
        <Container fluid className="main-height">
            <div className="page-margin-top">
                <h5 className="section-title">INTRODUCE YOUR DATA</h5>
                <Row>
                    <Col lg={12}>
                        <ul className="admin-ul">
                            <li>
                                <Link to={'/admin/transfer-ownership'}>

                                    <img src={Transfer} />
                                    <span>TRANSFER<br />OWNERSHIP</span>
                                </Link>

                            </li>
                            {/* <li>
                                <Link to={'#'}>

                                    <img src={BuySell} />
                                    <span>ADJUST BUY/SELL<br /> COMISSIONS</span>
                                </Link>

                            </li> */}
                            <li>
                                <Link to={'/admin/withdraw-wallet-team'}>

                                    <img src={Wallet} />
                                    <span>ADD/WITHDRAW<br /> WALLET (TEAM)</span>
                                </Link>

                            </li>
                            <li>
                                <Link to={'/admin/withdraw-wallet-partner'}>

                                    <img src={WalletPartner} />
                                    <span>ADD/WITHDRAW <br /> WALLET (PARTNER)</span>
                                </Link>

                            </li>
                            {/* <li>
                                <Link to={'#'}>

                                    <img src={Amount} />
                                    <span>MODIFY DeFi<br /> AMOUNT</span>
                                </Link>

                            </li> */}
                            {/* <li>
                                <Link to={'#'}>

                                    <img src={Dollar} />
                                    <span>MODIFY CeFi<br /> AMOUNT</span>
                                </Link>

                            </li> */}
                            {/* <li>
                                <Link to={'#'}>
                                    <img src={MakePayment} />
                                    <span>MAKE <br /> PAYMENT</span>
                                </Link>

                            </li> */}
                            {/* <li>
                                <Link to={'#'}>

                                    <img src={Calender} />
                                    <span>SET PAYMENT <br /> DATE</span>
                                </Link>

                            </li> */}
                            <li>
                                <Link to={'/admin/adjust/pool'}>
                                    <img src={Pool} />
                                    <span>ADJUST <br /> MINIPOOLS</span>
                                </Link>
                            </li>
                            <li>
                                <Link to={'/admin/news'}>

                                <img src={News} />
                                <span>ADD <br /> NEWS</span>
                                </Link>

                            </li>
                            <li>
                                <Link to={'/admin/modify-disclaimer'}>

                                <img src={Info} />
                                <span>MODIFY <br /> DISCLAIMERS</span>
                                </Link>

                            </li>
                            <li>
                                <Link to={'/admin/change-stable-coin'}>

                                <img src={Transfer} />
                                <span>Change <br /> Stable Coin</span>
                                </Link>

                            </li>
                        </ul>
                    </Col>
                </Row>
            </div>
        </Container>
    </>
}
export default Admin;