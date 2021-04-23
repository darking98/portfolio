import React from 'react'
import styled from 'styled-components'
import ticTacToe from '../images/tic-tac-toe.png'
import weather from '../images/api-weather-screen.jpg'
import {FiGithub} from 'react-icons/fi'
import {BiLinkExternal} from 'react-icons/bi'


const Projects = () => {
    return (
        <Container>
            <HeaderContainer>
                <h2>Mis proyectos</h2>
            </HeaderContainer>
            <ProjectsWrapper>
                <ImageWrapper>
                    <a href="https://darking98.github.io/tic-tac-toe/" target="_blank"><img src={ticTacToe} alt="" width="500px"/></a>
                </ImageWrapper>
                <InfoWrapper>
                    <HeaderInfo>
                        <h3>Tic-Tac-Toe</h3>
                    </HeaderInfo>
                    <TextInfo>
                        <p>El típico juego Tic-Tac-Toe hecho en Javascript Vanilla para poner en práctica mis conocimientos de lógica y programación.</p>
                    </TextInfo>
                    <TechnologiesUsed>
                        <h4>Javascript Vanilla</h4>
                        <h4>Scss/SASS</h4>
                        <h4>HTML</h4>
                    </TechnologiesUsed>
                    <IconsLink>
                        <a href="https://github.com/darking98/tic-tac-toe" target="_blank"><FiGithub/></a>
                        <a href="https://darking98.github.io/tic-tac-toe/" target="_blank"><BiLinkExternal/></a>
                    </IconsLink>
                </InfoWrapper>
            </ProjectsWrapper>
            <ProjectsWrapper>
                <ImageWrapper>
                    <a href="https://github.com/darking98/weather-api" target="_blank"><img src={weather} alt="" width="500px"/></a>
                </ImageWrapper>
                <InfoWrapper>
                    <HeaderInfo>
                        <h3>Weather App</h3>
                    </HeaderInfo>
                    <TextInfo>
                        <p>Mediante consultas a la api de <a href="https://weatherstack.com/" target="_blank">WeatherStack</a> la aplicacion muestra hora y temperatura del lugar deseado y a su vez, con la api de <a href="https://unsplash.com/" target="_blank">Unsplash</a> despliega una imagen con la ciudad ingresada en tiempo real.</p>
                    </TextInfo>
                    <TechnologiesUsed>
                        <h4>React Js</h4>
                        <h4>Styled Components</h4>
                        <h4>Weather Api</h4>
                        <h4>Unsplash Api</h4>
                    </TechnologiesUsed>
                    <IconsLink>
                        <a href="https://github.com/darking98/weather-api" target="_blank"><FiGithub/></a>
                        
                    </IconsLink>
                </InfoWrapper>
            </ProjectsWrapper>
        </Container>
    )
}


const Container = styled.div`
    display:grid;
    grid-template-columns:1fr 3fr 2fr 1fr;
    gap:20px 10px;
    grid-template-rows:fit-content(80px);
    margin-top:200px;
`
const HeaderContainer = styled.div`
    grid-column:2 / span 4;
    h2{
        color:var(--white);
        font-size:30px;
        font-weight:600;
        letter-spacing:1px;
        position:relative;
        :after{
            content:"";
            height:1px;
            background-color: var(--darkest-gray);
            width:450px;
            position:absolute;
            left:200px;
            top:40%;            
            color:white;
        }
    }
`

const ProjectsWrapper = styled.div`
    display:grid;
    grid-template-columns:repeat(2,1fr);
    gap:20px;
    width:100%;
    justify-content:space-between;
    grid-column:2 /span 2;
`
const ImageWrapper = styled.div`
    img{
        filter:grayscale(100%);
        transition:300ms ease-in-out;
        :hover{
            filter:none;
        }
    }
`

const InfoWrapper = styled.div`
    grid-column:2;
    display:flex;
    flex-direction:column;
    align-items:flex-end;
    justify-content:space-between;
`

const HeaderInfo = styled.div`
    h3{
        font-size:28px;
        color:var(--white);
        transition:300ms ease-in-out;
        :hover{
            color:var(--orange);
        }
    }
`

const TextInfo = styled.div`
    padding:20px;
    background-color: var(--lightest-black);
    box-shadow: 0px 5px 5px 0px rgba(0,0,0,0.75);
    p{
        font-size:20px;
        color:var(--lightest-gray);

        a{
            color:var(--orange);
            text-decoration:none;
            transition:300ms ease-in-out;
            :hover{
                color:var(--darkest-gray);
            }
        }
    }
`

const TechnologiesUsed = styled.div`
    width:100%;
    display:flex;
    justify-content:space-around;
    font-family:"SF Mono";

    h4{
        font-weight:100;
        font-size:12px;
        color:var(--white);

    }
`

const IconsLink = styled.div`
    width:100%;
    display:flex;
    justify-content:flex-end;
    a{
        color:var(--white);
        text-decoration:none;
        svg{
        
            margin-left:20px;
            font-size:20px;
            transition:300ms ease-in-out;
            :hover{
                color:var(--orange)
            }
        }
    }
    
`
export default Projects
