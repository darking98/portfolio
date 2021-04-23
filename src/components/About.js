import React from 'react'
import styled from 'styled-components'
import icons from './styled/icons.js'
import image from '../images/cv-image.jpg'

const About = () => {
    return (
        <Container>
            <HeaderContainer>
                <h2>About Me</h2>
            </HeaderContainer>
            <ImageContainer>
                <img src={image}  className ="image-fit"/>
            </ImageContainer>
            <InfoContainer>
                <p>
                Hello! My name is Brittany and I enjoy creating things that live on the internet. My interest in web development started back in 2012 when I decided to try editing custom Tumblr themes — turns out hacking together a custom reblog button taught me a lot about HTML & CSS!
                </p>
                <p>
                Fast-forward to today, and I've had the privilege of working at an advertising agency, a start-up, a huge corporation, and a student-led design studio. My main focus these days is building accessible, inclusive products and digital experiences at Upstatement for a variety of clients.
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
            left:150px;
            top:40%;            
            color:white;
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

    p{
        margin-bottom:20px;
    }
` 

const TechnologiesContainer = styled.div`
    display:flex;
    flex-direction:column;
    justify-content:space-around;
    grid-column:2 / span 2;
    color:var(--white);
    margin-top:50px;

    
    
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
        width:100px;
        display:flex;
        justify-content:center;
        align-items:center;
        border-radius:50px;

    }
    :after{
        position:absolute;
        top:105%;
        left:${(props) => `${props.description.length >= 9 ? "10px" : "7px"}`};
        border-style: solid;
        border-width: 25px 12.5px 0 12.5px;
        border-color: var(--lightest-black) transparent transparent transparent;
        transform:rotate(180deg);        
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

    img{
        z-index:20;
        position:relative;
        border-radius:5px;
        /*filter: sepia(68%) saturate(324%) hue-rotate(333deg) brightness(94%) contrast(93%);*/
        filter:grayscale(100%);
        transition:300ms ease-in-out;
        :hover{
            filter:none;
        }
    }
    :after{
        content:"";
        border:2px solid var(--orange);
        border-radius:5px;
        height:90%;
        width:100%;
        position:absolute;
        left:10%;
        bottom:18%;
        transition:all 200ms ease-in
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
    justify-content:space-around;

`