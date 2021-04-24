import React from 'react'
import styled from 'styled-components'
import {Button} from './styled/defaultStyledComponents'
import {FaLinkedin} from 'react-icons/fa'
import {AiFillGithub} from 'react-icons/ai'

const Contact = () => {
    return (
        <Container id="contact">
            <HeaderContainer>
                <h2>Estemos en contacto</h2>
            </HeaderContainer>
            <TextContainer>
                <p>
                    Actualmente estoy en busca de trabajo como Desarrollador Web Jr o afines.
                    Estoy disponible ante cualquier consulta que quieras hacerme.
                    Si deseas pactar una entrevista podes hacer click en el boton de abajo para enviarme un mail! 
                </p>
            </TextContainer>
            <a href="mailto:diego.gabrielrodriguez@hotmail.com">
                <Button padding ="20px">
                    Hablemos!
                </Button>
            </a>
            <SocialContainer>
                <a href="https://www.linkedin.com/in/diego-gabriel-rodriguez/" target="_blank">
                    <FaLinkedin/>
                </a>
                <a href="https://github.com/darking98" target="_blank">
                    <AiFillGithub/>
                </a>
            </SocialContainer>
        </Container>
    )
}

const Container = styled.div`
    display:flex;
    flex-direction:column;
    align-items:center;
    padding:100px 100px;
    margin:0px 200px;

    @media (max-width:1180px){
        padding:50px;
        margin:0;
    }
    & > *{
        margin:20px 0px;
    }


`

const HeaderContainer = styled.div`
    grid-column:2 / span 3;
    grid-row: 5;
    
    h2{
        color:var(--white);
        font-size:40px;
        font-weight:600;
        letter-spacing:1px;
        position:relative;
        text-transform:capitalize;

        @media (max-width:600px){
            font-size:25px;
        }
    }
`

const TextContainer = styled.div`
    p{
        text-align:center;
        margin:auto;
        font-size:18px;
        color:var(--darkest-gray);

        @media (max-width:600px){
            font-size:15px;
        }
    }
`

const SocialContainer = styled.div`
    display:flex;
    justify-content:space-around;

    svg{
        color:var(--white);
        font-size:30px;
        margin:0px 20px;
        transition:300ms ease-in-out;
        :hover{
            color:var(--orange);
        }

    }
`

export default Contact
