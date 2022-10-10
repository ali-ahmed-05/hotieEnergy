import { Link,useLocation } from "react-router-dom";
import { useState,useEffect } from 'react';
import Logo from '../assets/images/logo.png'
import Hes from '../assets/images/hes.png'
import Token from '../assets/images/token.png'
import Payment from '../assets/images/payment.png'
import Stake from '../assets/images/stake.png'
import Calculator from '../assets/images/calculator.png'
import News from '../assets/images/news.png'
import Disclaimer from '../assets/images/disclaimer.png'
import Partners from '../assets/images/partners.png'
import Team from '../assets/images/team.png'
import Admin from '../assets/images/admin.png'

import GreenHes from '../assets/images/green-hes.png'
import GreenToken from '../assets/images/green-token.png'
import GreenPayment from '../assets/images/green-payment.png'
import GreenStake from '../assets/images/green-stake.png'
import GreenCalculator from '../assets/images/green-calculator.png'
import GreenNews from '../assets/images/green-news.png'
import GreenDisclaimer from '../assets/images/green-disclaimer.png'
import GreenPartners from '../assets/images/green-partners.png'
import GreenTeam from '../assets/images/green-team.png'
import GreenAdmin from '../assets/images/green-admin.png'


function SideBar(props)
{
    const location = useLocation()
    const [url,setUrl] = useState(location.pathname)
    useEffect(() => {
        setUrl(location.pathname);
    })

    function closeNav() {
        var x = window.matchMedia("(max-width: 991px)")
        if (x.matches) { 
        document.getElementById("sidebar").style.width = "0";
        }
        // document.getElementById("sidebar").style.position = "sticky";
    }
    return <>
    <div className="sidebar" id="sidebar">
        <div className="close-nav-section">
        <div className="logo">
            <img src={Logo}/>
            <h4>User Name</h4>
        </div>
        <i class="fa-solid fa-times close-sidebar-icon" onClick={closeNav}></i>
        </div>

        <div className="sidebar-scroll">
        <ul className="sidebar-ul">
            <li className={url == "/" ? "active" :''}>
                <Link to={"/"} onClick={closeNav}><img src={url == "/" ? GreenHes : Hes}/><span>Buy hest</span></Link>
            </li>
            <li className={url == "/token-overview" ? "active" :''}>
                <Link to={"/token-overview"} onClick={closeNav}><img src={url == "/token-overview" ? GreenToken : Token}/><span>Token Overview </span></Link>
            </li>
            <li className={url == "/coming-payments" ? "active" :''}>
                <Link to={"/coming-payments"} onClick={closeNav}><img src={url == "/coming-payments" ? GreenPayment : Payment}/><span>Coming Payments</span></Link>
            </li>
            <li className={url == "/stake" ? "active" :''}>
            {/* <i class="fa-solid fa-question"></i> */}
                <Link to={"/stake"} onClick={closeNav}><img src={url == "/stake" ? GreenStake : Stake}/><span>Stake </span></Link>
            </li>
            <li className={url == "/calculator" ? "active" :''}>
                <Link to={"/calculator"} onClick={closeNav}><img src={url == "/calculator" ? GreenCalculator : Calculator}/><span>Calculator</span></Link>
            </li>
            <li className={url == "/news" ? "active" :''}>
                <Link to={"/news"} onClick={closeNav}><img src={url == "/news" ? GreenNews : News}/><span>News</span></Link>
            </li>
            <li className={url == "/disclaimer" ? "active" :''}>
                <Link to={"/disclaimer"} onClick={closeNav}><img src={url == "/disclaimer" ? GreenDisclaimer : Disclaimer}/><span>Disclaimer</span></Link>
            </li>
            <li className={url == "/partners" ? "active" :''}>
                <Link to={"/partners"} onClick={closeNav}><img src={url == "/partners" ? GreenPartners : Partners}/><span>Partners</span></Link>
            </li>
            <li className={url == "/team" ? "active" :''}>
                <Link to={"/team"} onClick={closeNav}><img src={url == "/team" ? GreenTeam : Team}/><span>Team</span></Link>
            </li>
            <li className={url == "/admin" ? "active" :''}>
                <Link to={"/admin"} onClick={closeNav}><img src={url == "/admin" ? GreenAdmin : Admin}/><span>Admin</span></Link>
            </li>
            <li className="side-social">
            <ul >
            <li>
                <a href="twitter.com"><i class="fa-brands fa-twitter"></i></a>
            </li>
            <li>
                <a href="telegram.com"><i class="fa-brands fa-telegram"></i></a>
            </li>

            <li>
                <a href="linkedin.com"><i class="fa-brands fa-linkedin"></i></a>
            </li>

            <li>
                <a href="instagram.com"><i class="fa-brands fa-instagram"></i></a>
            </li>

            <li>
                <a href="medium.com"><i class="fa-brands fa-medium"></i></a>
            </li>
            
        </ul>
            </li>
        </ul>

        
        
        </div>

    </div>
</>
}
export default SideBar;