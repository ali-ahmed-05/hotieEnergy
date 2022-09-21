import {Col, Container, Row} from "react-bootstrap";
import {FinancialChartStockIndexChart} from '../components/Index'
import _img from "../utils/_img";

const tokens = [
    {url: "https://www.bogged.finance/", image: 'bogged.png', label: 'Bogged Finance'},
    {url: "https://pancakeswap.finance/", image: 'pancake.png', label: 'PancakeSwap Finance'},
    {url: "https://poocoin.app/", image: 'poocoin.png', label: 'Poocoin'},
    {url: "https://coinmarketcap.com/", image: 'coinmarketcap.png', label: 'CoinMarketCap'},
    {url: "https://www.coingecko.com/", image: 'coingecko.png', label: 'Coingecko'},
    {url: "https://bscscan.com/", image: 'bscscan.png', label: 'BscContract'},
]

function BuyHes() {
    return <>
        <Container fluid className="main-height">
            <Row>
                <Col lg={8} md={12}>
                    <div className="custom-chart-margin">
                        <FinancialChartStockIndexChart/>
                    </div>
                </Col>
                <Col lg={4} md={12}>
                    {/* <div className="trade-section">
                        <p className="text-center head">Trade Tokens in an instant</p>
                        <div className="trade-btn-group">
                            <button className="custom-btn-sm btn-secondary-sm">BUY</button>
                            <button className="custom-btn-sm btn-primary-sm">SELL</button>
                        </div>
                        <div className="">
                            <div className="drop-down-btn">
                                <img src={Hest}/>
                                <span>Hest</span>
                                <img src={Arrow}/>
                            </div>
                            <input className="mt-1 form-control input-green"/>
                            <div className="mt-3 mb-3 text-center">
                                <button className="swap-btn"><img src={ArrowWhite}/></button>
                            </div>
                            <div className="drop-down-btn">
                                <img src={Usdt}/>
                                <span>Usdt</span>
                                <img src={Arrow}/>
                            </div>
                            <input className="mt-1 form-control input-green"/>
                            <div className="price-section">
                                <span className="green">Price</span>
                                <span>0.085 HEST Per USDT</span>
                                <i class="fa-solid fa-arrows-rotate green"></i>
                            </div>
                            <div className="price-section">
                                <span className="green">Commision</span>
                                <span>3%</span>
                            </div>
                            <div className="mt-2 text-center">
                            <button className="custom-btn secondary-btn">Buy</button>
                            </div>
                        </div>
                    </div> */}
                    <div className="mint-section">
                        <h5 class="btn-like">Buy HES Token</h5>
                        <ul className="buy-hest">
                            {tokens.map(({url, image, label}, index) => (
                                <li key={index}>
                                    <a href={url} target="_blank">
                                        <img src={_img(image)} alt={label}/>
                                        <span>{label}</span>
                                    </a>
                                </li>
                            ))
                            }
                        </ul>
                    </div>
                </Col>
            </Row>
        </Container>
    </>
}

export default BuyHes;