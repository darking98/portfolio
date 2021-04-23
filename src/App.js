import Header from './components/Header'
import Home from './components/Home'
import About from './components/About'
import Projects from './components/Projects'
import Contact from './components/Contact'
import styled from 'styled-components'

function App() {
  return (
    <div>
      <Header/>
      <Container>
        <Home/>
        <About/>
        <Projects/>
        <Contact/>
      </Container>
    </div>
    
  );
}

const Container = styled.div`
  padding:0px 200px;
  background-color: var(--black);

  @media (max-width:1500px){
    padding:0;
  }
`

export default App;
