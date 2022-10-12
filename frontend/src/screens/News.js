import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import HorizontalLogo from '../assets/images/horizontal-logo.png'
import apis from "../services/apis";

function News() {
    const navigate = useNavigate();
    const location = useLocation();
    let [searchParams, setSearchParams] = useSearchParams();
    const [news, setNews] = useState([]);
    const [limit, setLimit] = useState(2);
    const [page, setPage] = useState(searchParams.get('page') ? searchParams.get('page') : 1);
    const [totalPages, setTotalPages] = useState(0)
    useEffect(() => {
        (async () => {
            const res = await apis.getNews({ pageSize: limit, page, page });
            setNews(res.data.news)
            setTotalPages(res.data.totalPages)
        })()

    }, [page])
    const click = (num) =>{
        setPage(num)
        navigate(location.pathname+'?page='+num)
    }
    return <>
        <Container fluid className="main-height">
            <div className="page-margin-top">
                <Row className="gy-3">
                    {
                        news.map((item) => {
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
                       
                        {Array(totalPages).fill(0).map((_, index) => <li onClick={()=>click(index+1)} className={page == index+1 && "active"}>{index+1}</li>)}

                    </ul>
                </div>
            </div>
        </Container>
    </>
}
export default News;