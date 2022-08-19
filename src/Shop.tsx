
import { Badge, Card, Center, Group, SimpleGrid } from '@mantine/core';
import { Modal } from '@mantine/core';
import { useState } from 'react';
import { Button } from '@mantine/core';
import { ethers } from "ethers";
import { TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { NativeSelect } from '@mantine/core';
import { Text } from '@mantine/core';
import { Paper } from '@mantine/core';
import { Image } from '@mantine/core';
import { Grid } from '@mantine/core';
import { createStyles } from '@mantine/core';
import { Select } from '@mantine/core';
import { IconCheck, IconCloud, IconLeaf, IconMug, IconCoffee, IconMouse, IconDeviceGamepad2 } from '@tabler/icons';
import { Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons';
 

function Shop() {

  //Mumbai!
  const [isModalOpened, setModalOpened] = useState(false);
  const [isOrderButtonLoading, setOrderButtonLoading] = useState(false);
  const [error, setError] = useState({isError: false, code: 0, cssTag: "none"});


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [loggedin, setLoggedin] = useState({state: false, address: ''});

  const [orderSuccess , setOrderSuccess] = useState({state: false, orderID: '', orderEmail: ''});

  interface SelectedItem {
    item: string
    image: string
    price: number
    size: string | null
  }

  const [selectedItem, setSelectedItem] = useState<SelectedItem>({item: '', image: '', price: 0, size: null});


  const [userSigner, setSigner] = useState({});

  const contractAddress = "0xb933C15C9137A22dc70cBd6c263D7daA870D7f9C"
  const contractAbi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"charityAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"gbaAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"itemsSold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"percentage","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"purchase","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"totalDonated","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]

  const useStyles = createStyles((theme) => ({
    card: {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    },
  
    imageSection: {
      padding: theme.spacing.md,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderBottom: `1px solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
      }`,
    },
  
    label: {
      marginBottom: theme.spacing.xs,
      lineHeight: 1,
      fontWeight: 700,
      fontSize: theme.fontSizes.xs,
      letterSpacing: -0.25,
      textTransform: 'uppercase',
    },
  
    section: {
      padding: theme.spacing.md,
      borderTop: `1px solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
      }`,
    },
  
    icon: {
      marginRight: 5,
      color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[5],
    },
  }));

  
  interface Item {
    item: string;
    image: string;
    price: number;
    features: Array<{label: string, icon: any}>;
    hasSize: boolean;
    color: string;
  }
  
  
  function ItemCard(props:Item) {
  
    const [selectedSize, setSelectedSize] = useState<string | null>('S');
  
    const { classes } = useStyles();
    const features = props.features.map((feature) => (
      <Center key={feature.label}>
        <feature.icon size={18} className={classes.icon} stroke={1.5} />
        <Text size="xs">{feature.label}</Text>
      </Center>
    ));
  
    return (
      
     
      <Card withBorder radius="md" className={classes.card}>
        <Card.Section className={classes.imageSection}>
          <Image src={props.image} alt="Greenwich Tshirt" />
          
        </Card.Section>
  
        <Group position="apart" mt="md">
          <div style={{textAlign: 'left'}}>
            <Text weight={500}>{props.item}</Text>
            <Text size="xs" color="dimmed">
              Available
            </Text>
          </div>
          <Badge variant="outline">25% off</Badge>
        </Group>
  
        <Card.Section className={classes.section} mt="md">
          <Text size="sm" color="dimmed" className={classes.label} style={{textAlign: 'left'}}>
            Features:
          </Text>
  
          <Group spacing={8} mb={-8}>
            {features}
          </Group>


          {

          props.hasSize 

          ? 

          <Select
      style={{marginTop: '15px'}}
      label="Size"
      placeholder="Pick one"
      data={[
        { value: 'S', label: 'S' },
        { value: 'M', label: 'M' },
        { value: 'L', label: 'L' },
        { value: 'XL', label: 'XL' },
      ]}
      defaultValue={selectedSize}
      value={selectedSize}
      onChange={(value) => [console.log(value), setSelectedSize(value)]}
    /> 

    : 

        <Select disabled
      style={{marginTop: '15px'}}
      label="Colour"
      placeholder="Pick one"
      data={[
        { value: props.color, label: props.color }
      ]}
      defaultValue={props.color}
    />}
    


        </Card.Section>
  
        <Card.Section className={classes.section}>
          <Group spacing={30}>
            <div>
              <Text size="xl" weight={700} sx={{ lineHeight: 1 }}>
              £{props.price}
              </Text>
            </div>
  
            {props.hasSize ? <Button radius="xl" style={{ flex: 1 }} onClick={() => [setSelectedItem({item: props.item, image: props.image, price: props.price, size: selectedSize}), setModalOpened(true)]}>
              Buy now
            </Button> : <Button radius="xl" style={{ flex: 1 }} onClick={() => [setSelectedItem({item: props.item, image: props.image, price: props.price, size: null}), setModalOpened(true)]}>
              Buy now
            </Button>}


          </Group>
        </Card.Section>
      </Card>
  
  
    );
  }

  // Different grid depending if it needs a size (tshirt) or not (mug, mousepad).
  const CartItem = () => {

    if (selectedItem.size){

    return (

      <div>
      <Paper shadow="xs" p="sm" withBorder={true} style={{marginBottom: "10px"}}>
        <Grid align="center">
          <Grid.Col span={3}>
            <Image src={selectedItem.image} radius={"md"} height={"75px"} width={"75px"} />
          </Grid.Col>
          <Grid.Col span={3}>
            <Text weight={500}>{selectedItem.item}</Text>
          </Grid.Col>
          <Grid.Col span={3}>
            <Text>£{selectedItem.price}</Text>
          </Grid.Col>
          <Grid.Col span={3}>
            <Text>Size: {selectedItem.size}</Text>
          </Grid.Col>
        </Grid>
      </Paper>
      </div>
    )} else {
      return(      
      <div>
        <Paper shadow="xs" p="sm" withBorder={true} style={{marginBottom: "10px"}}>
          <Grid align="center">
            <Grid.Col span={4}>
              <Image src={selectedItem.image} radius={"md"} height={"75px"} width={"75px"} />
            </Grid.Col>
            <Grid.Col span={4}>
              <Text weight={500}>{selectedItem.item}</Text>
            </Grid.Col>
            <Grid.Col span={4}>
              <Text>£{selectedItem.price}</Text>
            </Grid.Col>
          </Grid>
        </Paper>
        </div>)
    }
  }

  const connectWallet = async () => {
    try{
      const userProvider = new ethers.providers.Web3Provider(window.ethereum);
      // Set the network to MATIC Mumbai
      let web3 = window.ethereum;
      await web3.request({method: "wallet_switchEthereumChain", params: [{chainId:"0x13881"}]});

      await userProvider.send('eth_requestAccounts', []);
      const userSigner = userProvider.getSigner();
      const address = await userSigner.getAddress();

      setSigner(userSigner);

      setLoggedin({state: true, address: address});

      console.log(address);
      console.log(userSigner);
      console.log(userProvider);
    
    
    } catch(e) {
      console.log(e);
    }
  }

  //order
  //change amount to order item and references
  // Name and Email can be taken from the state
  const transact = async () => {
    try{
      //Purchasing item, size console log


      // Fetch MATIC/GBP price from Coingecko API

      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=gbp');
      const data = await response.json();
      const maticGBPprice = data["matic-network"]["gbp"];

      const maticAmountToPay = selectedItem.price / maticGBPprice;
      console.log("Paying: " + maticAmountToPay + " MATIC");
      

      console.log("transacting amount: " + selectedItem.price + " GBP");
      const contract = new ethers.Contract(contractAddress, contractAbi, (userSigner as any));
      const tx = await contract.purchase({value: ethers.utils.parseEther(maticAmountToPay.toString())});
      console.log("transaction complete, txid is: " + tx.hash);

      //Once the transaction is complete, send the order to Azure Logic App to generate the order ID and send an email to the customer

      //Prepare the payload to send to Azure Logic App
      const orderPayload = {
        name: name,
        email: email,
        item: selectedItem.item,
        size: selectedItem.size ? selectedItem.size : "N/A",
        txid: tx.hash,

      }

      console.log(orderPayload);

      //The part with the Azure Logic App Request

      const azureEndpoint = 'https://prod-11.centralus.logic.azure.com:443/workflows/fafde01aa0f546ed82d75aa9a307279e/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ILnQdt-4tsIPZ1M4WLJlfzlFxrmVnQ1pFg4GuOjG60s';


      const azureRequest = await fetch(azureEndpoint, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(orderPayload)});

      const azureResponse = await azureRequest.json();

      const orderID = azureResponse["order_id"];
      console.log("Success!: " + orderID);

      setOrderSuccess({state: true, orderID: orderID, orderEmail: orderPayload.email});


    } catch(e:any) {
      console.log(e)
      setError({isError: true, code: e.code, cssTag: "flex"})
      setOrderButtonLoading(false);
    }
  }

  const loginForm = () => {
    return (

      <>
      <h2>Connect your Web3 Provider.</h2>
      <Button onClick={() => connectWallet()}>Login with MetaMask</Button>
      </>
    )
  }

  const successForm = () => {
    return (
      <>
      <h2>✔️ Order Successful!</h2>
      <p>Your Order ID is {orderSuccess.orderID}</p>
      <p>The pick-up information has been sent to {orderSuccess.orderEmail}</p>
      <Button color="red" onClick={() => [setModalOpened(false), setOrderSuccess({state: false, orderID: '', orderEmail: ''}), setError({isError: false, code: 0, cssTag: "none"})]}>
      Close
    </Button>
      </>)
  }

  const orderForm = () => {
    
    return (

      <>
      <CartItem/>
      <form onSubmit={(e) => [e.preventDefault(), transact(), console.log(name), console.log(email), setOrderButtonLoading(true)]}>

      <TextInput required label="Name" placeholder="Name" onInput={(e) => setName((e.target as HTMLInputElement).value)} {...form.getInputProps('name')} />

      <TextInput required mt="sm" label="Email" placeholder="Email" onInput={(e) => setEmail((e.target as HTMLInputElement).value)} {...form.getInputProps('email')} />
      <NativeSelect
      data={['Greenwich Campus']}
      label="Pickup Location"
      description="We're currently offering pick-ups at the Greenwich campus only."
      disabled
      required
      style={{marginTop: '10px'}}
    />
    <h2>Total: £{selectedItem.price}</h2>
    <h3 style={{marginTop: "-15px"}}>Includes a donation of: £{(selectedItem.price * 0.15).toFixed(2)}</h3>
      <Button loading={isOrderButtonLoading} type="submit" mt="sm" style={{marginTop: "-5px"}}>
        Pay with MATIC
      </Button>

      <Alert style={{marginTop: "15px", display: error.cssTag}} icon={<IconAlertCircle size={16} />} title="Error!" color="red">
      {error.code === -32603 ? "Insufficient funds." : "unknown error"}
    </Alert>
    </form>
    </>
    )
  }

  const form = useForm({
    initialValues: { name: '', email: '', age: 0 },

    // functions will be used to validate values at corresponding key
    validate: {
      name: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      age: (value) => (value < 18 ? 'You must be at least 18 to register' : null),
    },
  });



  return (
<div className="Shop">
  
{/*Order Form*/}
    <>
      <Modal
        opened={isModalOpened}
        onClose={() => [setModalOpened(false), setOrderSuccess({state: false, orderID: '', orderEmail: ''}), setError({isError: false, code: 0, cssTag: "none"})]}
        title={loggedin.state ? "Your order": "Login"}
        closeOnClickOutside={false}
      >
      {loggedin.state ? (orderSuccess.state ? successForm() : orderForm()) : loginForm()}
      </Modal>

    </>
              
              <SimpleGrid
        cols={3}
        breakpoints={[
          { maxWidth: 'md', cols: 2 },
          { maxWidth: 'xs', cols: 1 },
        ]}
      >
                <ItemCard {...{item: "I <3 GRE T-shirt", image: "https://i.imgur.com/63lfPtX.png", price: 29.99, features: [
    { label: 'Ethically sourced', icon: IconLeaf },
    { label: '100% cotton', icon: IconCloud },
    { label: 'Donate through your purchase', icon: IconCheck },
  ], hasSize: true, color: "Black"}}/>
                <ItemCard {...{item: "GBA Mug", image: "https://i.imgur.com/MnqsHWp.png", price: 14.99, features: [
    { label: 'Porcelain Mug', icon: IconMug },
    { label: "For Coffee and Tea", icon: IconCoffee },
    { label: 'Donate through your purchase', icon: IconCheck },
  ], hasSize: false, color: "White"}}/>
                <ItemCard {...{item: "GBA Mousepad", image: "https://i.imgur.com/6aJ2YwY.png", price: 7.99, features: [
    { label: '100% Accuracy', icon: IconDeviceGamepad2 },
    { label: 'Premium Mousepad', icon: IconMouse },
    { label: 'Donate through your purchase', icon: IconCheck },
  ], hasSize: false, color: "Black"}}/>
        </SimpleGrid>
    </div>
  );
}

export default Shop;
