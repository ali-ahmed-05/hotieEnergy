import {Button, Col, Form, Modal, Row} from "react-bootstrap";

const CompoundModal = ({
                           status = false,
                           poolTitle = [],
                           handleClose,
                           hestBalance,
                           stakedBalance,
                           handleClubStake,
                           handleSelectPool,
                           TotalRewardBalance
                       }) => {

    return (
        <Modal show={status} onHide={handleClose} size='lg'>
            <Modal.Header closeButton>
                <Modal.Title>Compound</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col>
                        <h6 className='text-center'>Total Stake Balance</h6>
                        <p className='text-center'> {stakedBalance} </p>
                    </Col>
                    <Col>
                        <h6 className='text-center'>Total Reward Balance</h6>
                        <p className='text-center'> {TotalRewardBalance} </p>
                    </Col>
                    <Col>
                        <h6 className='text-center'>Estimate HEST Balance</h6>
                        <p className='text-center'> {hestBalance} </p>
                    </Col>
                </Row>
                <hr/>
                <Row>
                    <Col>
                        <Form>
                            <Row>
                                {poolTitle.map((title, indx) => (
                                    <Col xs={4}>
                                        <Form.Group className="mb-3"
                                                    controlId="formBasicCheckbox custom-control custom-checkbox"
                                                    key={indx}>
                                            <Form.Check className='class="custom-control-input custom' type="checkbox"
                                                        label={title} onChange={() => handleSelectPool(indx)}
                                            />
                                        </Form.Group>
                                    </Col>
                                ))}
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="custom-btn secondary-btn" onClick={handleClubStake}>Club Stake</Button>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
};


export default CompoundModal;