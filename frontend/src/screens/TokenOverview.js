import {Col, Container, Row} from "react-bootstrap";
import {InvestmentHistory, PieChartToken} from '../components/Index'

import {useEffect, useState} from "react";
import {hestoken_addr, router_addr, staking_addr} from '../contract/addresses'

import ABI from '../contract/Staking.json'
import TokenABI from '../contract/HESTOKEN.json'
import RouterABI from '../contract/IUniswapV2Router02.json'

import IERC20Metadata from '../contract/IERC20Metadata.json'

import {useWeb3React} from "@web3-react/core";
import {ethers} from "ethers";
import {loadProvider} from "../utils";


function TokenOverview() {

    const {account} = useWeb3React();

    // const compoundModalProps = {poolTitle, status: compoundModal, handleClose: toggleModalState, handleSelectPool, TotalRewardBalance,hestBalance,stakedBalance,handleClubStake };
    const [detail, setDetail] = useState({})
    const data = {TotalColumns: detail?.TotalColumns, staked: detail?.userstakedArry}


    const valuetoRewardToken = async (amount, path, decimals) => {
        try {
            let signer = await loadProvider()
            let Routercontract = new ethers.Contract(router_addr, RouterABI, signer);
            let value = await Routercontract.getAmountsOut(amount, path)

            value = Number(ethers.utils.formatUnits(value[1].toString(), decimals)).toFixed(5)

            return value.toString()

        } catch (error) {
            console.log(error)
        }
    }

    const userDetail = async (signer, decimals, rewardToken_address, stakingContract) => {
        try {

            let rewardContract = new ethers.Contract(rewardToken_address, TokenABI, signer);

            let reward_decimals = await rewardContract.decimals()
            let currentPool = await stakingContract.currentPool()
            currentPool = Number(currentPool.toString())
            let userTotalStaked = 0
            let userTotalClaimable = 0
            let userstakedArry = []
            for (let index = 1; index <= currentPool; index++) {

                for (let inn = 1; inn < 9; inn++) {
                    let stakeInfo = await stakingContract.stakeInfo(account, inn, index)
                    let totalReward = await stakingContract.totalReward(account, inn, index, inn)
                    userstakedArry.push(Number(ethers.utils.formatUnits(stakeInfo[0].toString(), decimals)))
                    userTotalStaked += userstakedArry[userstakedArry.length - 1]
                    userTotalClaimable += Number(ethers.utils.formatUnits(totalReward.toString(), reward_decimals))
                    console.log(ethers.utils.formatUnits(stakeInfo[0].toString(), decimals))
                }
            }


            return {
                userstakedArry: userstakedArry,
                currentPool: Number(currentPool),
                userTotalStaked: userTotalStaked.toString(),
                userTotalClaimable: userTotalClaimable.toString(),
                reward_decimals
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getDetails = async () => {
        try {

            //totalSupply

            let signer = await loadProvider()
            let Tokencontract = new ethers.Contract(hestoken_addr, TokenABI, signer);
            let ERC20Metadata = new ethers.Contract(hestoken_addr, IERC20Metadata, signer);
            let stakingContract = new ethers.Contract(staking_addr, ABI, signer);

            console.log(Tokencontract)

            let decimals = await ERC20Metadata.decimals()
            let rewardToken_address = await stakingContract.rewardToken()

            let totalSupply = await Tokencontract.totalSupply()
            let totalLocked = await Tokencontract.balanceOf(staking_addr)
            let userBalance = await Tokencontract.balanceOf(account)

            let obj = {}

            obj.totalSupply = ethers.utils.formatUnits(totalSupply.toString(), decimals)
            obj.totalLocked = ethers.utils.formatUnits(totalLocked.toString(), decimals)
            obj.totalStaked = ethers.utils.formatUnits(totalLocked.toString(), decimals)

            obj.userBalance = ethers.utils.formatUnits(userBalance.toString(), decimals)

            let user = await userDetail(signer, decimals, rewardToken_address, stakingContract)

            obj.userStaked = user.userTotalStaked
            obj.userClaimable = user.userTotalClaimable
            obj.TotalColumns = user.currentPool
            obj.userstakedArry = user.userstakedArry

            obj.userRewardValue = await valuetoRewardToken(userBalance, [hestoken_addr, rewardToken_address], user.reward_decimals)

            console.log("obj.userRewardValue", obj.userRewardValue)

            setDetail(obj)

            console.log(ethers.utils.formatUnits(totalSupply.toString(), user.reward_decimals))

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(
        async () => {
            if (account) {
                await getDetails()
            }
        }
        , [account])

    const smartContractAllocation = [
        {label: 'total supply', value: detail?.totalSupply || 0},
        {label: 'TOTAL LOCKED', value: detail?.totalLocked || 0},
        {label: 'TOTAL STAKED', value: detail?.totalStaked || 0},
    ];

    const balances = [
        {label: 'TOTAL SUPPLY', value: detail.userBalance || 0, currency: 'HEST'},
        {label: 'VALUE', value: detail.userRewardValue || 0, currency: 'USD'},
        {label: 'STAKE BALANCE', value: detail.userStaked || 0, currency: 'HEST'},
        {label: 'CLAIMABLE BALANCE', value: detail.userStaked || 0, currency: 'USD'},
    ]

    return <>
        <Container fluid className="main-height">
            <div className="page-margin-top">
                <Row className="gy-5">
                    <Col lg={6} md={6}>
                        <div className='live-hest'>
                            <h2>Live hest <span>allocation</span></h2>
                        </div>
                        <PieChartToken/>
                    </Col>
                    <Col lg={6} md={6}>
                        <div className="token-section">
                            <div className="investment-history mb-3">
                                <h5>Your Investment History</h5>
                                <InvestmentHistory {...data}/>
                            </div>
                        </div>
                    </Col>
                    <Col lg={6} md={6}>
                        <div className="token-section">
                            <h5 className="green">SmartContract Allocation</h5>
                            {smartContractAllocation.map(({label, value}, index) => (
                                <div className="flex" key={index}>
                                    <span> {label} <span className="green">(hest)</span>:</span>
                                    <div style={{width: "200px", color: 'white'}} className="custom-bar">
                                        {value}
                                    </div>
                                </div>
                            ))
                            }
                        </div>
                    </Col>
                    <Col lg={6} md={6}>
                        <div className="token-section">
                            <div className="balance-section">
                                <h5 className="green">YOUR BALANCE</h5>
                                <span>Balance of {
                                    account ?
                                        account?.slice(0, 7) + '...' + account?.slice(account?.length - 4, account?.length)
                                        : "0x000000"} </span>
                            </div>
                            {balances.map(({label, value, currency}, index) => (
                                <div className="balance-flex" key={index}>
                                    <div className="inner">
                                        <span>{label}:</span>
                                    </div>
                                    <div className="inner d-flex">
                                        <div className="green-bar">
                                            <span>{value}</span>
                                        </div>
                                        {currency && <span className="token-name">{currency}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Col>
                </Row>
            </div>
        </Container>
    </>
}

export default TokenOverview;