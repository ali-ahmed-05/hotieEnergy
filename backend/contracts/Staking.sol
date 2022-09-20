// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

contract Staking is Ownable , Pausable , ReentrancyGuard {
    
    address public rewardToken;
    address private HESTTOKEN;

    address public supply; //51
    address public team; //1
    address public partner; //9
    address public digitHolder; //39
    
    uint256 public supply_cent = 51; //51
    uint256 public team_cent = 1; //1
    uint256 public partner_cent = 9; //9
    uint256 public digitHolder_cent = 39; //39

    uint256 public lastinitTime;
    uint256 public blocksPerMonth = 720; //864000;
    uint256 public blocksPerday = 24; //28800;
    uint256 public daysPerMonth = 30;
    uint256 public currentPool = 0;

    address public uniswapV2Pair;
    IUniswapV2Router02 public uniswapV2Router;

    uint256[][] private userPools;

    struct Pool{
        uint8 id;
        uint256 totalstaked;
        uint256 rewardTokenValue;
        uint256 min;
        uint256 max;
        uint256 noOfusers;
        uint256 creationTime;
        uint8 cent;
    }mapping(uint8 => mapping(uint256 => Pool)) public pool;



    struct StakeInfo{
        uint256 staked;
        uint256 reward;
        uint256 enteryTime;
        uint256 depositBlock;
        uint256 pendingRewards;
    }mapping(address => mapping(uint256 =>mapping(uint256 => StakeInfo))) public stakeInfo;

    struct StakeSnapshot{
        uint256 staked;
        uint256 enteryTime;
        uint256 depositBlock;
    }mapping(address => mapping(uint256  => StakeSnapshot)) public stakeSnapshot;

    

    struct DepositInfo{
        uint256 amount;
        uint256 supplyAmount;
        uint256 partnerAmount;
        uint256 teamAmount;
        uint256 digitAmount;
        uint256 enteryTime;
    }mapping(uint256 => DepositInfo) public depositInfo;



    mapping(address => uint256) public stakedBalance;

    constructor(address _supply , address _partner , address _team){
        supply = _supply;
        partner = _partner;
        team = _team;
    }

    
    function setRewardTokenAddress(address _token) public onlyOwner { 

        require(_token != address(0),"invalid address");
        require(getPair(HESTTOKEN  , _token) != address(0) ,"the pair doesnt exist");
        
        if(rewardToken != address(0)){
        uint256 balanceOf = IERC20(rewardToken).balanceOf(address(this));
        uint256 allowance = IERC20(_token).allowance(owner(),address(this));
        require(allowance / IERC20Metadata(_token).decimals() >= balanceOf / IERC20Metadata(rewardToken).decimals() , 
        "please provide reward token in exact amount");
        IERC20(rewardToken).transfer( owner() , balanceOf);
        IERC20(_token).transferFrom( owner() , address(this) , allowance);
        }
        rewardToken = _token;
    }



    function setHESTAddress(address _HESTTOKEN) public onlyOwner {
        require(_HESTTOKEN != address(0),"invalid address");
        HESTTOKEN = _HESTTOKEN;
    }

    function set_supplycent(uint256 _cent) public onlyOwner {
        require(_cent != 0 && _cent + team_cent + partner_cent + digitHolder_cent <= 100, "invalid uint256");
        supply_cent = _cent;
    }

    function set_teamcent(uint256 _cent) public onlyOwner {
        require(_cent != 0 && _cent + supply_cent + partner_cent + digitHolder_cent <= 100,"invalid uint256");
        team_cent = _cent;
    }
    function set_partnercent(uint256 _cent) public onlyOwner {
        require(_cent != 0 && _cent + team_cent + supply_cent + digitHolder_cent <= 100,"invalid uint256");
        partner_cent = _cent;
    }
    function set_digiholdercent(uint256 _cent) public onlyOwner {
        require(_cent != 0 && _cent + team_cent + partner_cent + supply_cent <= 100,"invalid address");
        digitHolder_cent = _cent;
    }

    function setRouterAddress(address newRouter) public onlyOwner() {
       //Thank you FreezyEx
       IUniswapV2Router02 _uniswapV2Router = IUniswapV2Router02(newRouter);
        // Create a uniswap pair for this new token
        // uniswapV2Pair = IUniswapV2Factory(_uniswapV2Router.factory()).getPair(rewardToken,HESTTOKEN);
        // set the rest of the contract variables
        uniswapV2Router = _uniswapV2Router;
    }

    function initiatePools(uint8[8] memory percentages , uint256[8] memory min , uint256[8] memory max) public onlyOwner{
        
        require(block.number > lastinitTime + blocksPerMonth , "connot initiate pools before one month");
        require(percentages.length == min.length && min.length == max.length && max.length == 8,"initialing error :: values");
        uint8 i;
        currentPool++;
        for(i=1; i<9; i++){

        require(percentages[i-1] <= 92,"decimals not allowed");

        pool[i][currentPool].cent = percentages[i-1];
        
        pool[i][currentPool].min = min[i-1] * 10 **IERC20Metadata(HESTTOKEN).decimals();
        pool[i][currentPool].max = max[i-1] * 10 **IERC20Metadata(HESTTOKEN).decimals();
        pool[i][currentPool].creationTime = block.number;
        console.log("block.number",block.number);
        }
       
        lastinitTime = block.number;
    }

    function calcRewards(address account , uint8 _id ,uint256 _Poolno) public view returns (uint256) { // remaining
        
        StakeInfo memory detail = stakeInfo[account][_id][_Poolno];
        uint256 currentblock = block.number;
       
        uint256 depositBlock = detail.depositBlock;
        // new
        uint256 blocks = currentblock - depositBlock;



          console.log("contract :: depositBlock",depositBlock);
          console.log("contract :: creationTime",pool[_id][_Poolno].creationTime);
          console.log("contract :: _Poolno",_Poolno);
          console.log("contract :: _id",_id);

        if(depositBlock == 0)
        return 0;
       
        if(blocks < blocksPerday)
        return 0;

        if(blocks > blocksPerMonth){
             unchecked {
                if(blocksPerMonth + pool[_id][_Poolno].creationTime > depositBlock){
                 blocks = ( blocksPerMonth + pool[_id][_Poolno].creationTime ) - depositBlock;
                }else{
                    return 0;
                }
            }
        }
        
        
        
        uint256 userShare = detail.staked;
       // console.log("contract :: userShare",userShare);
        uint256 totalStaked = pool[_id][_Poolno].totalstaked ;
       // console.log("contract :: totalStaked",totalStaked);
        uint256 totalReceived = pool[_id][_Poolno].rewardTokenValue ;
       // console.log("contract :: totalReceived",totalReceived);
        uint256 apyRevenue = (totalReceived * userShare) / totalStaked;
       // console.log("contract :: apyRevenue",apyRevenue);

        
       // (totalReceived * _shares[account]) / _totalShares
        if(apyRevenue == 0 ){
                return (0);
        }else {
        uint256 ratePerDay = ( apyRevenue ) / 30 ;
        return   ( blocks / blocksPerday ) * ratePerDay ;
        
        }

    }

    function getPair(address token0,address token1) public view returns(address){
        return IUniswapV2Factory(uniswapV2Router.factory()).getPair(token0,token1);
    }

    function totalReward(address account , uint8 _id , uint256 _Poolno , uint256 _currentPool) public view returns(uint256) {
        return stakeInfo[account][_id][_Poolno].pendingRewards + calcRewards(account , _id , _Poolno) ; 
    }

    
    
    function withdrawRewards(address account , uint8 _id , uint256 _Poolno ) public {

        if (_Poolno == currentPool){

        require(block.number > pool[_id][_Poolno].creationTime + blocksPerMonth , "connot withdraw reward now");

        }
        uint256 amount = totalReward( account , _id , _Poolno , currentPool );

        require(amount > 0 , "no rewards pending");

        

        stakeInfo[account][_id][_Poolno].pendingRewards = 0 ; 
        stakeInfo[account][_id][_Poolno].depositBlock = 0 ;

        

        IERC20(rewardToken).transfer( account , amount);
        IERC20(HESTTOKEN).transfer( account , stakeInfo[account][_id][_Poolno].staked);

        stakeInfo[account][_id][_Poolno].staked = 0;
        
    }

  
    function clubRewards(address account , bool send , uint8[] memory _ids) public {
        uint256 amount = 0 ;
        uint256 HestAmount = 0 ;
        for (uint256 index = 1; index < currentPool; index++) {
            for (uint8 _Poolno = 1; _Poolno < 9; _Poolno++) {

                uint256 tempAmount = totalReward( account , _Poolno , index  ,_Poolno);

                if(tempAmount == 0)
                continue;


                amount += tempAmount;
                
                HestAmount += stakeInfo[account][_Poolno][index].staked ; // for development 
                stakeInfo[account][_Poolno][index].staked = 0; // for development 

                console.log("Contract :: HestAmount", HestAmount);

                stakeInfo[account][_Poolno][index].pendingRewards = 0 ; 
                stakeInfo[account][_Poolno][index].depositBlock = 0 ;
            }
        }

        require(amount > 0 , "cannot withdraw rewards before 1 month");


        console.log("contract :: amount",amount);

        if(send){
            IERC20(rewardToken).transfer(account , amount);
        }else{
            uint256[] memory outAmount = swapTokensForTokens(amount,address(this));
            // console.log("Contract :: inAmount", outAmount[0]);
            // console.log("Contract :: outAmount", outAmount[1]);
            // IERC20(HESTTOKEN).transfer(account , HestAmount);    // for development
            uint256 total = HestAmount + outAmount[1];
            // console.log("Contract :: per1 total hest ", total);
            for (uint8 index = 0; index < _ids.length; index++) {      

                uint256 result = localStake(total , _ids[index]);
                total = result;
                console.log("Contract :: total", result);

            } 
            if(total > 0 ){
                IERC20(HESTTOKEN).transfer(account , amount);
            }
        }
        

    }

    function saveRewards(address account , uint8 _id , uint256 _Poolno ) private {
        stakeInfo[account][_id][_Poolno].depositBlock = block.number;
        stakeInfo[account][_id][_Poolno].pendingRewards += calcRewards(account ,_id ,_Poolno);
    }

    function localStake(uint256 amount , uint8 _id ) private returns(uint256){
        require(block.number < lastinitTime + blocksPerMonth , "No Pools active");
              console.log("Contract :: LOCALSTAKE 0" , pool[_id][currentPool].min);
              console.log("Contract :: LOCALSTAKE 0" , amount);
        if(pool[_id][currentPool].min < amount){
              console.log("Contract :: LOCALSTAKE 1");
            StakeInfo memory detail = stakeInfo[_msgSender()][_id][currentPool];
            if(detail.staked > 0){ // many times 
            console.log("Contract :: LOCALSTAKE 2");
                //save rewards
                saveRewards(_msgSender(),_id ,currentPool);
                 stakeSnapshot[_msgSender()][currentPool].enteryTime += block.timestamp;

                
            }else{                                    
                console.log("Contract :: LOCALSTAKE 3");                 // first time
                pool[_id][currentPool].noOfusers++;
                detail.enteryTime = block.number;
                detail.depositBlock = block.number;
                
            // userPools.push([currentPool,_id]);
            }

            uint256 result = 0; 
            uint256 difference =0;
            console.log("contract :: localPool 4");
            if(pool[_id][currentPool].max < amount){
                console.log("Contract :: LOCALSTAKE 5");
            difference = pool[_id][currentPool].max -  detail.staked ;
            detail.staked += difference;

            stakeSnapshot[_msgSender()][currentPool].staked += difference;
            stakeSnapshot[_msgSender()][currentPool].depositBlock += block.timestamp;
            
            pool[_id][currentPool].totalstaked += difference;
            result =  amount - difference;

            }else if(pool[_id][currentPool].min < amount){
                console.log("Contract :: LOCALSTAKE 6");
             detail.staked += amount;
             pool[_id][currentPool].totalstaked += amount;
             result = 0; 
            }
            console.log("Contract :: LOCALSTAKE 7");
            stakeInfo[_msgSender()][_id][currentPool] =  detail;
            
            return result;
        }else{
            console.log("Contract :: LOCALSTAKE 8");
            return amount;
        }
            console.log("Contract :: LOCALSTAKE 9");
    } 

    function timeRequirement() public view returns(bool condition){
        condition = false;
        if(block.number < lastinitTime + blocksPerMonth){
            condition = true;
        }
    }

    function stake(uint8 _id) public {

        uint256 amount = IERC20(HESTTOKEN).allowance(_msgSender() , address(this));
        uint256 amountStked = stakeInfo[_msgSender()][_id][currentPool].staked + amount;
        console.log("Contract :: HEST allowance :",amount);

        require(amountStked >= pool[_id][currentPool].min && amountStked <= pool[_id][currentPool].max,"please provide with respect to pool");
        require(timeRequirement() , "pools period expired");

        IERC20(HESTTOKEN).transferFrom(
        _msgSender(),
        address(this),
        amount
        );

        StakeInfo memory detail = stakeInfo[_msgSender()][_id][currentPool];


        if(detail.staked > 0){ // many times 
            //save rewards
            saveRewards(_msgSender(),_id ,currentPool);
        }else{     
            //first time
            pool[_id][currentPool].noOfusers++;
            detail.enteryTime = block.number;
            detail.depositBlock = block.number;
            stakeSnapshot[_msgSender()][currentPool].enteryTime += block.timestamp;

            //userPools.push([currentPool,_id]);
        }

        stakeSnapshot[_msgSender()][currentPool].staked += amount;
        stakeSnapshot[_msgSender()][currentPool].depositBlock += block.timestamp;

        detail.staked += amount;

        pool[_id][currentPool].totalstaked +=amount;

 
        

        stakeInfo[_msgSender()][_id][currentPool] =  detail;

    }

    

    function unStake(uint8 _id ,uint8 _Poolno , uint256 amount) public { //poolno ~ cuurentpool

        require(stakeInfo[_msgSender()][_id][_Poolno].staked >= amount ,"please unstake in correct amount");

        IERC20(HESTTOKEN).transfer(
        _msgSender(),
        amount
        );

        saveRewards(_msgSender(),_id ,_Poolno);

        if(stakeInfo[_msgSender()][_id][_Poolno].staked - amount == 0){
            pool[_id][currentPool].noOfusers--;
        }

        stakeInfo[_msgSender()][_id][_Poolno].staked -= amount;

    }



    function addRewardToken(uint256 amount)public onlyOwner {

        require(amount >= 100 *10**IERC20Metadata(rewardToken).decimals(),"please provide atleast 100 Reward token");
        require(IERC20(rewardToken).allowance(owner() , address(this)) >= amount ,"please approve Reward token");
        require(block.number < lastinitTime + blocksPerMonth , "pools period expired");
        
        uint256 _supplyAmount =  (amount/100)*supply_cent;
        uint256 _partnerAmount = (amount/100)*partner_cent;
        uint256 _teamAmount = (amount/100)*team_cent;
        uint256 _digiholderAmount = (amount/100)*digitHolder_cent;


        
        IERC20(rewardToken).transferFrom(
        owner(),
        address(this),
        amount
        );

        IERC20(rewardToken).transfer(
        supply,
        _supplyAmount
        );
        IERC20(rewardToken).transfer(
        partner,
        _partnerAmount
        );
        IERC20(rewardToken).transfer(
        team,
        _teamAmount
        );

        depositInfo[currentPool] = DepositInfo(
               amount,
        _supplyAmount,
        _partnerAmount,
        _teamAmount,
        _digiholderAmount,
        block.timestamp
        );

        uint8 i;

        for(i=1; i<9; i++){

            require(pool[i][currentPool].cent >= 1,"please initiate pool first");
            pool[i][currentPool].rewardTokenValue = (_digiholderAmount/100) * pool[i][currentPool].cent;
        
        }

    }


    function addLiquidity(address _token) public {  // only for development Reward token / HESTTOKEN

     IERC20(_token).approve(address(uniswapV2Router), IERC20(_token).balanceOf(address(this)));
     IERC20(HESTTOKEN).approve(address(uniswapV2Router), IERC20(HESTTOKEN).balanceOf(address(this)));
     uniswapV2Router.addLiquidity(_token , HESTTOKEN , IERC20(_token).balanceOf(address(this)) , IERC20(HESTTOKEN).balanceOf(address(this)) , 0 , 0 , _msgSender() , block.timestamp);

    }

    function swapTokensForTokens(
        uint256 tokenAmount,
        address outputAddress
    ) private returns(uint[] memory amounts) {
        address[] memory path = new address[](2);
        path[0] = rewardToken;
       // path[1] = uniswapV2Router.WETH();
        path[1] = HESTTOKEN;

        IERC20(rewardToken).approve(address(uniswapV2Router), tokenAmount);

        // make the swap
        amounts = uniswapV2Router.swapExactTokensForTokens(
            tokenAmount,
            0,
            path,
            outputAddress,
            block.timestamp
        );
    }
    
}



// todo :

// 1 . enumeration 
// 2 . unstake
// 3 . stablecoin change 