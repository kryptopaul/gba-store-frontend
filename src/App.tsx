import { HeaderResponsive } from './HeaderResponsive';
import Shop from './Shop';
import { Container } from '@mantine/core';
import { Footer } from './Footer';
import { StatsGrid } from './StatsGrid';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons';


const headerLinks = [{link: 'https://google.com', label: 'Home'}, {link: 'https://google.com', label: 'About'}];
const footerLinks = [{title: 'Dupa', links: [{label: 'Link1', link: 'https://google.com'}]}]

const alchemyEndpoint = "https://polygon-mumbai.g.alchemy.com/v2/Us5Q5NYXkHhKPrpit0cJ2yaf4lKjwV4i" 
const contractAddress = "0xb933C15C9137A22dc70cBd6c263D7daA870D7f9C"
const contractAbi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"charityAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"gbaAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"itemsSold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"percentage","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"purchase","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"totalDonated","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]
const publicProvider = new ethers.providers.JsonRpcProvider(alchemyEndpoint);
const fetchContract = new ethers.Contract(contractAddress, contractAbi, publicProvider);

async function fetchData() {
  const itemsSold = await fetchContract.itemsSold();
  const totalDonated = await fetchContract.totalDonated();
  const roundedTotalDonated = parseFloat(ethers.utils.formatEther(totalDonated)).toFixed(4);
  const data = {itemsSold: itemsSold.toString(), totalDonated: roundedTotalDonated};
  return data;
}


function App() {

  const [displayAlert, setDisplayAlert] = useState('block');

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
        <Alert onClose={() => setDisplayAlert('none')} style={{display: displayAlert}} withCloseButton icon={<IconAlertCircle size={16} />} title="We're donating 15% from each sale to Ukraine." color="indigo">
      15% from each sale will be donated to the Ukrainian government. Each order is processed by a smart contract accessible <a style={{color: 'white'}} href='https://mumbai.polygonscan.com/address/0xb933c15c9137a22dc70cbd6c263d7daa870d7f9c' target={"_blank"} rel="noreferrer">here</a> for extra transparency.
    </Alert>
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
