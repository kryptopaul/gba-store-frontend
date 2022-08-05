
import { HeaderResponsive } from './HeaderResponsive';
import Shop from './Shop';
import { Container } from '@mantine/core';
import { Footer } from './Footer';
import { StatsGrid } from './StatsGrid';



const headerLinks = [{link: 'https://google.com', label: 'Home'}, {link: 'https://google.com', label: 'FAQ'}, {link: 'https://google.com', label: 'Contact'}];
const footerLinks = [{title: 'Dupa', links: [{label: 'Link1', link: 'https://google.com'}]}]


function App() {



  return (
    <div className="App">
      <HeaderResponsive links={headerLinks}/>
      <Container size={'md'}>



        <div style={{marginTop: '-100px'}}>
          <StatsGrid data={[{title: 'Total items sold', icon: 'coin', value: '217', diff: 10, type: 1}, {title: 'Total donated', icon: 'coin', value: '134 MATIC', diff: 0, type: 2}]}/>
          <Shop/>
        </div>
      </Container>
      <Footer data={footerLinks} />
    </div>
  );
}



export default App;
