import { HeaderResponsive } from './HeaderResponsive';
import Shop from './Shop';
import { Container } from '@mantine/core';
import { Footer } from './Footer';
import { StatsGrid } from './StatsGrid';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';



const headerLinks = [{link: 'https://google.com', label: 'Home'}, {link: 'https://google.com', label: 'FAQ'}, {link: 'https://google.com', label: 'Contact'}];
const footerLinks = [{title: 'Dupa', links: [{label: 'Link1', link: 'https://google.com'}]}]

const alchemyEndpoint = "HTTP://127.0.0.1:8545" 
const contractAddress = "0xdB2e1afF5Db2F4D32FD25a9d421C923cECCF91f7"
const contractAbi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"charityAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"gbaAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"itemsSold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"percentage","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"purchase","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"totalDonated","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]
const publicProvider = new ethers.providers.JsonRpcProvider(alchemyEndpoint);
const fetchContract = new ethers.Contract(contractAddress, contractAbi, publicProvider);

async function fetchData() {
  const itemsSold = await fetchContract.itemsSold();
  const totalDonated = await fetchContract.totalDonated();
  const data = {itemsSold: itemsSold.toString(), totalDonated: ethers.utils.formatEther(totalDonated).toString()};
  return data;
}


function App() {

  const [fetchedData, setFetchedData] = useState({itemsSold: "Loading...", totalDonated: "Loading..."});

  const [usdValue, setUsdValue] = useState("Loading...");

  useEffect(() => {

    (async() => {
      const data = await fetchData();
      setFetchedData(data);
      const priceData = await (await fetch("https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd")).json();
      const fetchedUsdPrice = priceData["matic-network"].usd

      
      const currentUsdValue = (fetchedUsdPrice * parseFloat(data.totalDonated)).toFixed(2);

      setUsdValue(currentUsdValue);

    })()

  }, []);


  return (
    <div className="App">
      <HeaderResponsive links={headerLinks}/>
      <Container size={'md'}>



        <div style={{marginTop: '-100px'}}>
          <StatsGrid data={[

          {title: 'Total items sold', icon: 'coin', value: fetchedData.itemsSold, diff: 1, type: 1, usdPrice: 0}, 

          {title: 'Total donated', icon: 'coin', value: fetchedData.totalDonated + " MATIC", diff: 1, type: 2, usdPrice: (usdValue)}

          ]}/>
          <Shop/>
        </div>
      </Container>
      <Footer data={footerLinks} />
    </div>
  );
}



export default App;
