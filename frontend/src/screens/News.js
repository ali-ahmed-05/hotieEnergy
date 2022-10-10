import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import HorizontalLogo from '../assets/images/horizontal-logo.png'
import apis from "../services/apis";

function News(){
    const [news,setNews] = useState([]);
  
    useEffect(()=>{
        (async () => {
            const res = await apis.getNews();
            setNews(res.data.news)

        })()

    },[])
    return <>
            <Container fluid className="main-height">
                <div className="page-margin-top">
                <Row className="gy-3">
                    {
                        news.map((item)=>{
                            return (
                            <Col lg={12} md={12} key={item.id}>
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
                <div className="paginate-main">
                    <ul className="paginate-ul">
                        <li>
                            1
                        </li>
                        <li>
                            2
                        </li>
                        <li>
                            3
                        </li>
                        <li>
                            4
                        </li>
                    </ul>
                </div>
                </div>
            </Container>
    </>
}
export default News;