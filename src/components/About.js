import React from 'react'
import styled from 'styled-components'
import icons from './styled/icons.js'
import image from '../images/cv-image.jpg'

const About = () => {
    return (
        <Container id="about">
            <HeaderContainer>
                <h2>About Me</h2>
            </HeaderContainer>
            <ImageContainer>
                <img src={image}  className ="image-fit"/>
            </ImageContainer>
            <InfoContainer>
                <p>
                    Hola! Mi nombre es Diego y estoy incursionando en el mundo de la programación web. Empecé en el mundo de la programación cuando tenía 10 años intentando hacer animaciones con flash usando ActionScript y usando RPG Maker. Hace 3 años retomé haciendo cursos por internet de C# y el curso de ITMaster de Java.
                </p>
                <p>
                    A fines del 2020 me empezó a interesar el desarrollo web y es por eso que hice un curso en Coderhouse de HTML/CSS para luego seguir aprendendiendo de forma autodidacta Javascript y React.
                </p>
            </InfoContainer>
            <TechnologiesContainer>
                <TechnologiesHeader>
                    <h3>Teconologias que uso</h3>
                </TechnologiesHeader>

                <TechnologiesIcons>
                    {icons.map((icon) => {
                        return(
                            <IconsWrapper description = {icon.description}>
                                {icon.icon}
                            </IconsWrapper>
                        )
                    })
                    }
                </TechnologiesIcons>
                
            </TechnologiesContainer>

            
        </Container>
    )
}

export default About


const Container = styled.section`
    display:grid;
    grid-template-columns:1fr 3fr 2fr 1fr;
    gap:20px 10px;
    grid-template-rows:fit-content(80px);

    @media (max-width:1000px){
        grid-template-columns:2fr 1fr;
        padding:0px 80px;

    }

    @media (max-width:600px){
        padding:0px 30px;
    }
`

const HeaderContainer = styled.div`
    grid-column:2 / span 4;

    @media (max-width:1000px){
        grid-column:1 /span 2;
    }
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
            left:150px;
            top:40%;            
            color:white;

            @media (max-width:1000px){
                width:60%;
            }
        }
    }
`

const InfoContainer = styled.div`
    display:flex;
    flex-direction:column;
    justify-content:center;
    grid-column:2;
    font-size:18px;
    color:var(--lightest-gray);

    @media (max-width:1000px){
        grid-column:1 / span 3;
        grid-row:2;
    }
    p{
        margin-bottom:20px;
        font-size:15px;
    }
` 

const TechnologiesContainer = styled.div`
    display:flex;
    flex-direction:column;
    justify-content:space-around;
    grid-column:2 / span 2;
    color:var(--white);
    margin-top:50px;

    
    @media (max-width:1000px){
        grid-column:1 / span 3;
        grid-row:4;
    }
    
`

const IconsWrapper = styled.span`
    position:relative;
    :before{
        position:absolute;
        top:130%;
        left:${(props) => `${props.description.length >= 9 ? "-27px" : "-30px"}`};
        font-size:20px;
        font-weight:500;
        background-color: var(--lightest-black);
        height:100px;
        right:0;
        width:100px;
        display:flex;
        justify-content:center;
        align-items:center;
        border-radius:50px;
        z-index:10; 
        @media (max-width:600px){
            top:90%;
            left:-10px;
        }
    }
    :after{
        position:absolute;
        top:105%;
        left:${(props) => `${props.description.length >= 9 ? "10px" : "7px"}`};
        border-style: solid;
        border-width: 25px 12.5px 0 12.5px;
        border-color: var(--lightest-black) transparent transparent transparent;
        transform:rotate(180deg);     
        
        @media (max-width:600px){
            top:70%;
            left:35%;
        }
    }


    :hover:before{
        content:${(props) => `"${props.description ? props.description : ''}"`};

    }
    :hover:after{
        content:"";
    }

    svg{

            color:var(--darkest-gray);
            font-size:40px;
            transition: 300ms ease-in-out;
            :hover{
                color:var(--orange)
            }
        }
`

const ImageContainer = styled.div`
    grid-column:3;
    grid-row:2;
    display:flex;
    position:relative;

    @media (max-width:1000px){
        grid-row:3;
        grid-column:1 / span 3;
        margin:50px auto;
    }

    img{
        z-index:20;
        position:relative;
        border-radius:5px;
        filter:grayscale(100%);
        transition:300ms ease-in-out;
        width:300px;

        @media (max-width:600px){
            width:150px;
        }
        :hover{
            filter:none;
        }
    }
    :after{
        content:"";
        border:2px solid var(--orange);
        border-radius:5px;
        height:90%;
        width:75%;
        position:absolute;
        left:10%;
        bottom:18%;
        transition:all 200ms ease-in;

        @media (max-width:1180px){
            width:100%;
        }
    }

    :hover:after{
        //transform:translateX(-10px);
        transform:translate(-10px, 10px);
    }
`

const TechnologiesHeader = styled.div`
    display:flex;
    justify-content:center;
    font-family:"SF Mono";
    margin-bottom:50px;


    h3{
        position:relative;
        font-size:20px;
        :after{
            content:"";
            width:50%;
            background-color: var(--white);
            height:5px;
            position:absolute;
            left:25%;
            top:150%;
            border-radius:10px;
        }
    }
`

const TechnologiesIcons = styled.div`
    display:flex;
    justify-content:space-between;
    flex-wrap:wrap;

    svg{
        @media (max-width:600px){
            margin:20px 20px;
        }
    }

`