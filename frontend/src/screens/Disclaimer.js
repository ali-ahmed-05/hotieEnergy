import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import HorizontalLogo from '../assets/images/horizontal-logo.png';
import apis from "../services/apis";
function Disclaimer(){
    const [disclaimers,setDisclaimers] = useState([]);
  
    useEffect(async()=>{
        const res = await apis.getDisclaimer();
        setDisclaimers(res.data.disclaimers)
    },[])
    return <>
            <Container fluid className="main-height">
                <div className="page-margin-top">
                <Row className="gy-3">
                    {
                        disclaimers.map((item)=>{
                            return (
                            <Col lg={12} key={item.id}>
                                <div className="token-section">
                                    <div className="news-height">
                                    <h5 className="title-section">{item.title}</h5>
                                    <p className="mt-3">{item.description}</p>
                                    </div>
                                </div>
                            </Col>
                            )
                          })
                    }
                </Row>
                </div>
            </Container>
    </>
}
export default Disclaimer;