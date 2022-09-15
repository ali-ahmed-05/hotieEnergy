import { useState } from "react";
import { Col, Container, Row,Table, Form } from "react-bootstrap";
import Hest from '../../assets/images/hest.png';
import apis from "../../services/apis";
const ModifyDisclaimer = () => {
    const [title,setTitle] = useState('');
    const [description,setDescription] = useState('');
    const [loader,setLoader] = useState(false);
    const [msg,setMsg] = useState('')
    const [status,setStatus] = useState('')
    const storeDisclaimer = async(e) => {
        e.preventDefault();
        setLoader(true);
        var body = {"title":title,"description":description};
        await apis.createDisclaimer(body)
        .then(function (res) {
            setMsg(res.data.message)
            setStatus('success')
            setLoader(false);

        })
        .catch(function (error) {
            setMsg(error.data.message)
            setStatus('error')
            setLoader(false);
        })
    }
    return <>
            <Container fluid className="main-height">

                <Row>

                    <Col xl={12} lg={12}>

                        <div className="page-margin-top">

                        <div className="how-it-work">
                            <h5 className="section-title">MODIFY DISCLAIMER</h5>
                        </div>

                            {/* <p className="pt-4">Total ~ 7809</p> */}

                            <div className="stake-top stable-coin-page">

                                <Row>
                                    <Col lg={4} className="m-auto">

                                    <div className="wallet-blnc">
                                        
                                        <div className="advance-pool stable-input-box ">
                                           <form onSubmit={storeDisclaimer}>
                                           <h5 className="section-title">Add Disclaimer</h5>
                                            <div className="hest-to-usd">
                                            <input className="form-control" required placeholder="title" value={title} onChange={(e)=>setTitle(e.target.value)}/>
                                            <textarea rows="5" className="form-control mt-3" required onChange={(e)=>setDescription(e.target.value)}>{description}</textarea>
                                            {
                                                <span className={status == "success" ? "text-success" : "text-danger"}>{msg}</span>
                                            }
                                            {
                                                loader ?
                                                <button class="small-btn" disabled>Loading...</button>
                                                :
                                                <button class="small-btn">Submit</button>
                                            }
                                            
                                            </div>
                                           </form>

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


export default ModifyDisclaimer