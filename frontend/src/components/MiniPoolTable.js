import {useEffect, useState} from "react";
import {Table} from "react-bootstrap";
import apis from "../services/apis";


function Minipooltable() {
    const [investmentData, setInvestmentData] = useState([]);
    useEffect(() => {
        (async () => {
            try {
                const response = await apis.getAllPoolAddresses()
                setInvestmentData(response.data.data)
            } catch (e) {
                console.log('Error in Pool Table', e)
            }
        })()
    }, []);

    return (

        <>
            <div className="table-responsive">
                <Table className="stake-table">
                    <thead>
                    <tr>
                        <th>N</th>
                        <th>User Wallet Address</th>
                        <th>Hest - Stake Balance</th>
                        {/*<th style={{whiteSpace: "pre"}}>lorem ipsum del lora</th>*/}
                    </tr>
                    </thead>

                    <tbody>
                    {investmentData.length > 0 && investmentData.map((record, indx) => (
                        <tr key={indx}>
                            <td>{indx+1}</td>
                            <td className="ellipsis">{record?.address || 0}</td>
                            <td>{record.balance || 0}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>
        </>
    )


}

export default Minipooltable;
