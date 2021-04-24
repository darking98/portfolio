import React from 'react'
import styled from 'styled-components'
import {Button} from './styled/defaultStyledComponents'

const Home = () => {
    return (
        <Container id="home">
            <HeaderContainer>
                <h1>Hola, mi nombre es</h1>
                <h2>Diego Rodriguez</h2>
                <h3>Soy un desarrollador web Jr en React</h3>
            </HeaderContainer> 
            <InfoContainer>
                <p>
                    Soy un estudiante autodidacta de programación
                    buscando mi primera experiencia
                    laboral en sistemas con ansias de
                    aprendizaje y crecimiento
                    profesional.
                </p>
            <Button padding="15px 30px">
                Hablemos!
            </Button>
            </InfoContainer>

        </Container>    
    )
}

const Container = styled.div`
    height:100vh;
    margin:0px 100px;
    display:flex;
    justify-content:center;
    flex-direction:column;
    background-color: var(--black);

    @media (max-width:600px){
        margin:0px 50px;
    }

`

const HeaderContainer = styled.div`
    display:flex;
    justify-content:center;
    flex-direction:column;
    h1{
        letter-spacing:1px;
        margin-bottom:15px;
        font-size:15px;
        color:var(--orange);
        font-family:"SF Mono";
        font-weight:400;
    }

    h2,h3{
        font-weight:600;
        font-size:70px;

        @media (max-width:700px){
            font-size:25px;
        }
    }

    h2{
        color:white;
    }

    h3{
        color:var(--darkest-gray);
    }


`

const InfoContainer = styled.div`
    max-width:600px;
    color:var(--lightest-gray);

    p{
        margin-bottom:20px;
        line-height:25px;
        font-size:20px;

        @media(max-width:700px){
            font-size:15px;
        }
    }
`

export default Home
