
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
import { IconCheck, IconCloud, IconLeaf } from '@tabler/icons';
 

function Shop() {

  //Mumbai!
  

  const [opened, setOpened] = useState(false);
  const [loggedin, setLoggedin] = useState({state: false, address: ''});
  const [selectedItem, setSelectedItem] = useState({item: '', image: '', price: 0});


  const [userProvider, setUserProvider] = useState({});
  const [userSigner, setSigner] = useState({});
  const [address , setAddress] = useState('');

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
  }
  
  
  function ItemCard(props:Item) {
  
  
  
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
              Exclusive to Greenwich students
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
        </Card.Section>
  
        <Card.Section className={classes.section}>
          <Group spacing={30}>
            <div>
              <Text size="xl" weight={700} sx={{ lineHeight: 1 }}>
              £{props.price}
              </Text>
            </div>
  
            <Button radius="xl" style={{ flex: 1 }} onClick={() => [setSelectedItem({item: props.item, image: props.image, price: props.price}), setOpened(true)]}>
              Buy now
            </Button>
          </Group>
        </Card.Section>
      </Card>
  
  
    );
  }

  const CartItem = () => {
    return (

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


    )
  }

  const connectWallet = async () => {
    try{
      const userProvider = new ethers.providers.Web3Provider(window.ethereum);
      await userProvider.send('eth_requestAccounts', []);
      const userSigner = userProvider.getSigner();
      const address = await userSigner.getAddress();

      setUserProvider(userProvider);
      setSigner(userSigner);

      setAddress(address);
      setLoggedin({state: true, address: address});

      console.log(address);
      console.log(userSigner);
      console.log(userProvider);
    
    
    } catch(e) {
      console.log(e);
    }
  }

  const transact = async (amount:number) => {
    try{
      console.log("transacting amount: " + amount);
    } catch(e) {
      console.log(e)
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


  const orderForm = () => {
    return (
      <>
      <CartItem/>
      <form onSubmit={form.onSubmit(console.log)}>
      <TextInput required label="Name" placeholder="Name" {...form.getInputProps('name')} />
      <TextInput required mt="sm" label="Email" placeholder="Email" {...form.getInputProps('email')} />
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
      <Button type="submit" mt="sm" style={{marginTop: "-5px"}} onClick={() => transact(selectedItem.price)}>
        Purchase
      </Button>
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
        opened={opened}
        onClose={() => setOpened(false)}
        title={loggedin.state ? "Your order": "Login"}
        closeOnClickOutside={false}
      >
      {loggedin.state ? orderForm() : loginForm()}
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
    { label: 'Support UoG through your purchase', icon: IconCheck },
  ]}}/>
                <ItemCard {...{item: "GBA Mug", image: "https://i.imgur.com/MnqsHWp.png", price: 14.99, features: [
    { label: 'Ethically sourced', icon: IconLeaf },
    { label: '100% cotton', icon: IconCloud },
    { label: 'Support UoG through your purchase', icon: IconCheck },
  ]}}/>
                <ItemCard {...{item: "GBA Mousepad", image: "https://i.imgur.com/6aJ2YwY.png", price: 7.99, features: [
    { label: 'Ethically sourced', icon: IconLeaf },
    { label: '100% cotton', icon: IconCloud },
    { label: 'Support UoG through your purchase', icon: IconCheck },
  ]}}/>
        </SimpleGrid>
    </div>
  );
}

export default Shop;
