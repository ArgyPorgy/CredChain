import React from "react";

import Script from "dangerous-html/react";
import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import abi from "../contracts/Autocrate.json";
//import './App.css';
import { ethers } from "ethers";
import axios from "axios";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2"; 
import "./home.css";
import { useAppContext } from "../AppContext";
import Footer from "./Footer";

const JobsAvailable = (props) => {
  const { state, setState } = useAppContext()
  const { provider, signer, contract, account, authenticated } = state;
  const [isConnected, setConnection] = useState(false);
  const [connectmsg, setMsg] = useState("Connect Wallet");
  const [totalmints, setMints] = useState(0);
  const [accounts, setAccounts] = useState([]);
  const [reputation_score, setReputationScore] = useState([]);
  const [randomBgcolor, setRandomBg] = useState([]);
  const [showGraph, setGraph] = useState(false);
  const [skills, setSkills] = useState();
  const [skill_name, setSkillname] = useState([]);
  const [skill_value, setSkillvalue] = useState([]);
  const [chat, setChat] = useState();
  const [showChat, setshowchat] = useState(false);
  const [prompt, setPrompt] = useState();
//   const [curr_mints, settotalMints] = useState(0);
//   const [curr_endorsements_received, setEndorsementReceived] = useState(0);
//   const [curr_endorsements_given, setEndorsementGiven] = useState(0);
//   const [curr_reputation, setCurReputation] = useState(0);
  const leaderboardData = accounts.map((account, index) => ({
    account,
    score: reputation_score[index],}))
    leaderboardData.sort((a, b) => b.score - a.score);
  

//   const nftipfsAddress = "https://gateway.lighthouse.storage/ipfs/";
  const randomColor = () => `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 1)`;

  const checkConnectionBeforeConnecting = () => {
    if(!isConnected){
      connectWallet();
    }
  }

  const ChatwithData = async(event) => {
    event.preventDefault();
    const query = document.querySelector('#prompt').value;
    const response = await axios.get(`http://localhost:8001/chat?query=${query}`);
    setPrompt(query);
    setChat(response.data);
    setshowchat(true);
    event.target.reset()
};

  const connectWallet = async () => {
    const contractAddress = "0x8264a7B7d02ab5eF1e57d0ad10110686D79d8d46"//"0x681a204B065604B2b2611D0916Dca94b992f0B41";//"0x61eFE56495356973B350508f793A50B7529FF978";
    const contractAbi = abi.abi;
    try {
      const { ethereum } = window;
      if (ethereum) {
        ethereum.on("chainChanged", () => {
          window.location.reload();
        });
        ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = accounts[0];
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const signer = provider.getSigner();

        const contract = new ethers.Contract(
          contractAddress,
          contractAbi,
          signer
        );
        const authenticated = false;
        console.log(account)
        setState({ provider: provider, signer: signer, contract: contract, account: account, authenticated: authenticated });
        setConnection(true);
        setMsg(account);
        const contractwithsigner = contract.connect(signer);
        const resp = await contractwithsigner.getTotalMints();
        const mints = resp.toNumber()
        setMints(mints);
        // const all_accounts = await contractwithsigner.getAccounts();
        const response_skills = await axios.get('http://localhost:8001/getAllJobs');
        const skills = response_skills.data;
        console.log(skills);
        setSkills(skills);
        const skill_names = Object.keys(skills);
        const skill_values = Object.values(skills);
        setSkillname(skill_names);
        setSkillvalue(skill_values);
        const response = await axios.get('http://localhost:8001/getJobs');
        const all_accounts = response.data[0];
        const all_jobs = response.data[1];
        setReputationScore(all_jobs);
        setAccounts(all_accounts);
        console.log(all_accounts);
        console.log(all_jobs);
        // Generate an array of random background colors
        const randombg = Array.from({ length: all_accounts.length }, () => randomColor());
        setRandomBg(randombg);
        setGraph(true);
        // settotalMints(current_mints);
        // setEndorsementGiven(curr_endorsements_given);
        // setEndorsementReceived(curr_endorsements_received)
        // setCurReputation(total_acc_score);
        // console.log(current_mints, curr_endorsements_given, curr_endorsements_received, total_acc_score);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="home-container">
      <Helmet>
        <title>Job Demand Index</title>
        <meta property="og:title" content="Dashboard" />
      </Helmet>
      <header data-thq="thq-navbar" className="home-navbar">
        <span className="home-logo"><a  href="/">
              CredChain
            </a></span>
        <div
          data-thq="thq-navbar-nav"
          data-role="Nav"
          className="home-desktop-menu"
        >
          <nav
            data-thq="thq-navbar-nav-links"
            data-role="Nav"
            className="home-nav"
          >
            
            <a href="/multiple" className="home-button2 button-clean button">
              Multiple Transaction
            </a>
            <a href="/portfolio" className="home-button2 button-clean button">
              Portfolio
            </a>
            <a href="/reputation" className="home-button2 button-clean button">
              Reputation
            </a>
            <a href="/jobsavailable" className="home-button2 button-clean button">
              Jobs Demand Index
            </a>
          </nav>
        </div>
        <div data-thq="thq-navbar-btn-group" className="home-btn-group">
          
          <button onClick={checkConnectionBeforeConnecting} className="home-button6 button">
            {connectmsg}
          </button>
        </div>
        <div data-thq="thq-burger-menu" className="home-burger-menu">
          <button className="button home-button5">
            <svg viewBox="0 0 1024 1024" className="home-icon">
              <path d="M128 554.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667zM128 298.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667zM128 810.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667z"></path>
            </svg>
          </button>
        </div>
        <div data-thq="thq-mobile-menu" className="home-mobile-menu">
          <div
            data-thq="thq-mobile-menu-nav"
            data-role="Nav"
            className="home-nav1"
          >
            <div className="home-container1">
              <span className="home-logo1">CredChain</span>
              <div data-thq="thq-close-menu" className="home-menu-close">
                <svg viewBox="0 0 1024 1024" className="home-icon02">
                  <path d="M810 274l-238 238 238 238-60 60-238-238-238 238-60-60 238-238-238-238 60-60 238 238 238-238z"></path>
                </svg>
              </div>
            </div>
            <nav
              data-thq="thq-mobile-menu-nav-links"
              data-role="Nav"
              className="home-nav2"
            >
            <a href="/multiple" className="home-button2 button-clean button">
              Multiple Transaction
            </a>

            </nav>
            <div className="home-container2">
              <button className="home-login button">Login</button>
              <button className="button">Register</button>
            </div>
          </div>
          <div className="home-icon-group">
            <svg viewBox="0 0 950.8571428571428 1024" className="home-icon04">
              <path d="M925.714 233.143c-25.143 36.571-56.571 69.143-92.571 95.429 0.571 8 0.571 16 0.571 24 0 244-185.714 525.143-525.143 525.143-104.571 0-201.714-30.286-283.429-82.857 14.857 1.714 29.143 2.286 44.571 2.286 86.286 0 165.714-29.143 229.143-78.857-81.143-1.714-149.143-54.857-172.571-128 11.429 1.714 22.857 2.857 34.857 2.857 16.571 0 33.143-2.286 48.571-6.286-84.571-17.143-148-91.429-148-181.143v-2.286c24.571 13.714 53.143 22.286 83.429 23.429-49.714-33.143-82.286-89.714-82.286-153.714 0-34.286 9.143-65.714 25.143-93.143 90.857 112 227.429 185.143 380.571 193.143-2.857-13.714-4.571-28-4.571-42.286 0-101.714 82.286-184.571 184.571-184.571 53.143 0 101.143 22.286 134.857 58.286 41.714-8 81.714-23.429 117.143-44.571-13.714 42.857-42.857 78.857-81.143 101.714 37.143-4 73.143-14.286 106.286-28.571z"></path>
            </svg>
            <svg viewBox="0 0 877.7142857142857 1024" className="home-icon06">
              <path d="M585.143 512c0-80.571-65.714-146.286-146.286-146.286s-146.286 65.714-146.286 146.286 65.714 146.286 146.286 146.286 146.286-65.714 146.286-146.286zM664 512c0 124.571-100.571 225.143-225.143 225.143s-225.143-100.571-225.143-225.143 100.571-225.143 225.143-225.143 225.143 100.571 225.143 225.143zM725.714 277.714c0 29.143-23.429 52.571-52.571 52.571s-52.571-23.429-52.571-52.571 23.429-52.571 52.571-52.571 52.571 23.429 52.571 52.571zM438.857 152c-64 0-201.143-5.143-258.857 17.714-20 8-34.857 17.714-50.286 33.143s-25.143 30.286-33.143 50.286c-22.857 57.714-17.714 194.857-17.714 258.857s-5.143 201.143 17.714 258.857c8 20 17.714 34.857 33.143 50.286s30.286 25.143 50.286 33.143c57.714 22.857 194.857 17.714 258.857 17.714s201.143 5.143 258.857-17.714c20-8 34.857-17.714 50.286-33.143s25.143-30.286 33.143-50.286c22.857-57.714 17.714-194.857 17.714-258.857s5.143-201.143-17.714-258.857c-8-20-17.714-34.857-33.143-50.286s-30.286-25.143-50.286-33.143c-57.714-22.857-194.857-17.714-258.857-17.714zM877.714 512c0 60.571 0.571 120.571-2.857 181.143-3.429 70.286-19.429 132.571-70.857 184s-113.714 67.429-184 70.857c-60.571 3.429-120.571 2.857-181.143 2.857s-120.571 0.571-181.143-2.857c-70.286-3.429-132.571-19.429-184-70.857s-67.429-113.714-70.857-184c-3.429-60.571-2.857-120.571-2.857-181.143s-0.571-120.571 2.857-181.143c3.429-70.286 19.429-132.571 70.857-184s113.714-67.429 184-70.857c60.571-3.429 120.571-2.857 181.143-2.857s120.571-0.571 181.143 2.857c70.286 3.429 132.571 19.429 184 70.857s67.429 113.714 70.857 184c3.429 60.571 2.857 120.571 2.857 181.143z"></path>
            </svg>
            <svg viewBox="0 0 602.2582857142856 1024" className="home-icon08">
              <path d="M548 6.857v150.857h-89.714c-70.286 0-83.429 33.714-83.429 82.286v108h167.429l-22.286 169.143h-145.143v433.714h-174.857v-433.714h-145.714v-169.143h145.714v-124.571c0-144.571 88.571-223.429 217.714-223.429 61.714 0 114.857 4.571 130.286 6.857z"></path>
            </svg>
          </div>
        </div>
      </header>
      <section className="home-hero">
        
      {!isConnected && <div className="EmptySpace">
        <h1 className="home-header">Please connect Wallet.</h1>
        </div>}
      </section>
      {isConnected && <label className='mint-btn button'>Total CredChain's Volume: {totalmints}
      </label>}
      {/* {isConnected && <label className='home-button7 button'>Total SBT's shared to your Account: {curr_endorsements_received} <br></br>
      Total SBT's shared by you: {curr_endorsements_given} <br></br>
      Total Reputation Score: {curr_reputation} <br></br>
      </label>} */}

      

      {isConnected && <span className="reputation-txt">Job Demands Index</span>}
      <div className="home-hero">
      {showGraph &&  
        <span className="reputation-txt">Job Opening Index</span>&&
        <Line
      data={{ 
        // Name of the variables on x-axies for each bar 
        labels: accounts, 
        datasets: [ 
          { 
            label: "Highest on Demand Job skills score", 
            // Data or value of your each variable 
            // data: reputation_score,
            data: reputation_score,
            // Color of each bar 
            backgroundColor: randomBgcolor, 
            // Border color of each bar 
            borderColor: 'rgba(0, 0, 0, 1)', 
            borderWidth: 1.5,
            fill: true, // Enable fill for area under the line (optional) 
          }, 
        ], 
      }} 
      // Height of graph 
      height={400} 
      width={2000}
      options={{ 
        maintainAspectRatio: false, 
        scales: { 
          yAxes: [ 
            { 
              ticks: { 
                // The y-axis value will start from zero 
                beginAtZero: true, 
              }, 
            }, 
          ], 
        }, 
        legend: { 
          labels: { 
            fontSize: 20, 
          }, 
        }, 
      }} 
    /> }
    </div>

    {isConnected && <span className="reputation-txt">Job Opening Doughnut Chart</span>}
    <div className="home-hero">

    {showGraph && <span className="reputation-txt">Job Opening User score- Doughnut Chart</span> &&
    <Doughnut
    data={{
      labels: accounts,
      datasets: [
        {
          label: "Skill based score",
          data: reputation_score,
          backgroundColor: randomBgcolor,
          borderColor: 'rgba(0, 0, 0, 1)',
          borderWidth: 1.5,
        },
      ],
    }}
    height={400}
    width={2000}
    options={{
      // Options specific to doughnut charts (if needed)
      cutoutPercentage: 60, // Adjust the hole size in the center (default: 50)
      maintainAspectRatio: false,
      legend: {
        labels: {
          fontSize: 20,
        },
      },
    }}
  />}
    </div>

    {isConnected && <span className="reputation-txt">Skills Index</span>}
    <div className="home-hero">
    {showGraph && <span className="reputation-txt">Skills Index</span> &&
    <Pie
    data={{
      labels: skill_name,
      datasets: [
        {
          label: "Skills",
          data: skill_value,
          backgroundColor: randomBgcolor,
          borderColor: 'rgba(0, 0, 0, 1)',
          borderWidth: 1.5,
        },
      ],
    }}
    height={400}
    width={2000}
    options={{
      // Options specific to doughnut charts (if needed)
      cutoutPercentage: 60, // Adjust the hole size in the center (default: 50)
      maintainAspectRatio: false,
      legend: {
        labels: {
          fontSize: 20,
        },
      },
    }}
  />}
    </div>

    <div className="leaderboard-container">
      <h2 className="ld-title">LEADERBOARD</h2>
      <table className="leaderboard-table">
      <thead>
      <tr>
        <th></th>
        <th>Skills</th>
        <th>Availability</th>
      </tr>
     </thead>
     <tbody>

     {showGraph && Object.keys(skills).map((data, index) => (
        <tr key={index}>
          <td>{index + 1}</td> {/* Display row numbers starting from 1 */}
          <td>{data}</td>
          <td>{skills[data]}</td>
        </tr>
      ))}
    
      </tbody>
    </table>

    </div>

    {/* <form onSubmit={ChatwithData} className='login-container'>
        <label className='home-logo'>Ask me anything</label> 
         <label className='home-links'style={{color: "white"}}>Enter a prompt</label>
         <input type="text" id="prompt" className="button"></input>

         <button type="submit" className='home-button6 button'>Send</button>
         
     </form>
     {showChat &&
        <ul className="flex-container">
          <div className="home-card SBT" style={{width: 700}}>
          <li className="home-paragraph">Question: {prompt}
          </li>
          <li className="home-paragraph">Response: {chat}
          </li>
          <br></br>
          </div>
        </ul>} */}

    
    

      <section className="home-description">
        <img
          alt="image"
          src="/hero-divider-1500w.png"
          className="home-divider-image"
        />
      </section>

      <Footer></Footer>
      <div>
        <Script>
          
        </Script>
      </div>
    </div>
  );
};

export default JobsAvailable;
