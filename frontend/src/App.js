import { useState } from 'react';
import './App.css';
import Home from './components/Home';
import {SideBar,Header,Footer} from './components/Index';
import {BuyHes,TokenOverview,Payments,News,Disclaimer,
  Partners,Team,Admin,Stake,Calculator, AdjustPool,ChangeStableCoin, PoolDetail, TransferOwnerShip, WithdrawWalletTeam, WithdrawWalletPartner} from './screens/Index';
import { useEagerConnect, useInactiveListener } from './hooks/useEagerConnect';
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';


function App() {
  const [errorMessage, setErrorMessage] = useState();
  useEagerConnect(setErrorMessage);
  useInactiveListener();

  return (
    <div className="App main-body">
      {/* {
        errorMessage? <div style={{color:"red"}}>{errorMessage}</div>: null
      }
      <Header setErrorMessage={setErrorMessage}/>
      <Home /> */}
      <Router>
      <SideBar />
      <div className="main-section">
        <Header setErrorMessage={setErrorMessage}/>
        <Routes>
        <Route path="/" element={<BuyHes/>}  />
        <Route path="/token-overview" element={<TokenOverview/>}  />
        <Route path="/coming-payments" element={<Payments/>}  />
        <Route path="/stake" element={<Stake/>}  />
        <Route path="/pool-detail/:id" element={<PoolDetail/>}  />
        <Route path="/calculator" element={<Calculator/>}  />
        <Route path="/news" element={<News/>}  />
        <Route path="/disclaimer" element={<Disclaimer/>}  />
        <Route path="/partners" element={<Partners/>}  />
        <Route path="/team" element={<Team/>}  />
        <Route path="/admin" element={<Admin/>}  />
        <Route path="/admin/adjust/pool" element={<AdjustPool/>}  />
        <Route path="/admin/change-stable-coin" element={<ChangeStableCoin/>}  />
        <Route path="/admin/transfer-ownership" element={<TransferOwnerShip/>}  />
        <Route path="/admin/withdraw-wallet-team" element={<WithdrawWalletTeam/>}  />
        <Route path="/admin/withdraw-wallet-partner" element={<WithdrawWalletPartner/>}  />
        
        </Routes>
        <Footer/>
      </div>
      </Router>
    </div>
  );
}

export default App;
