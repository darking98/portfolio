import React,{useState} from 'react'
import styled from 'styled-components'
import {Button} from './styled/defaultStyledComponents'
import {GiHamburgerMenu} from 'react-icons/gi'
import {Link, animateScroll as scroll} from 'react-scroll'
import {ImCross} from 'react-icons/im'
import Pdf from '../pdf/curriculum.pdf'

const Header = () => {
    const [displayMenu,setDisplayMenu] = useState(false);


    return (
        <Navbar>
            <LogoWrapper>
                <span>DR</span>
            </LogoWrapper>
            <NavLinksWrapper className={displayMenu ? "menu-active" : ""}>
                <NavItemsUl onClick = {() => displayMenu ? setDisplayMenu(false) : ""}>
                    <NavItems >
                        <Link
                            to="home"
                            spy={true}
                            smooth={true}
                            offset={-100}
                            duration={500}
                            onClick = {() => displayMenu ? setDisplayMenu(false) : ""}
                        >                       
                            Home
                        </Link>
                    </NavItems>

                    <NavItems>
                        <Link
                            to="about"
                            spy={true}
                            smooth={true}
                            offset={-100}
                            duration={500}
                            onClick = {() => displayMenu ? setDisplayMenu(false) : ""}
                        >  
                            About
                        </Link>
                    </NavItems>

                    <NavItems>
                        <Link
                            to="projects"
                            spy={true}
                            smooth={true}
                            offset={-100}
                            duration={500}
                            onClick = {() => displayMenu ? setDisplayMenu(false) : ""}
                        >  
                            Projects
                        </Link>
                    </NavItems>

                    <NavItems>
                        <Link
                            to="contact"
                            spy={true}
                            smooth={true}
                            offset={-100}
                            duration={500}
                            onClick = {() => displayMenu ? setDisplayMenu(false) : ""}
                        >  
                            Contact
                        </Link>
                    </NavItems>

                </NavItemsUl>
                <NavResume>
                    <a href={Pdf} target="_blank">
                        <Button padding = "10px">
                            Resume
                        </Button>
                    </a>

                </NavResume>
            </NavLinksWrapper>
            <BurgerWrapper onClick={() => setDisplayMenu(!displayMenu)}>
                {displayMenu ? 
                    <ImCross/>
                 : 
                    <GiHamburgerMenu/>
                }
            </BurgerWrapper>
        </Navbar>
    )
}

const Navbar = styled.nav`
    position:relative;
    width:100%;
    height:7vh;
    position:fixed;
    display:flex;
    justify-content:space-between;
    align-items:center;
    background-color: var(--black);
    color:var(--white);
    padding: 0px 50px;
    font-family:"SF Mono";
    box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75);
    z-index:999;
    @media (max-width:1000px){

    }
`
const LogoWrapper = styled.div`

`

const NavLinksWrapper = styled.div`
    display:flex;
    justify-content:center;
    align-items:center;
    transition:all 300ms ease-in-out;

    @media (max-width:1000px){
        position:absolute;
        top:100%;
        right:-100%;
        flex-direction:column;
        justify-content:center;
        height:100vh;
        width:50%;
        background-color: var(--lightest-black);

    }
    
`
const NavItemsUl = styled.ul`
    display:flex;
    align-items:center;
    justify-content:center;

    @media (max-width:1000px){
        flex-direction:column;
        justify-content:center;

    }

    li:first-child{
        animation: drop 1s ease;
    }
    
    li:nth-child(2n){
        animation: drop 1.2s ease;
    }
    
    li:nth-child(3n){
        animation: drop 1.4s ease;
    }
    
    li:nth-child(4n){
        animation: drop 1.6s ease;
    }
`

const NavItems = styled.li`
    padding:0px 20px;
    list-style:none;
    height:auto;
    font-size:13px;
    position:relative;

    @media (max-width:1000px){
        font-size:30px;
        padding-bottom:50px;
    }

    @media (max-width:600px){
        font-size:20px;
        padding-bottom:30px;
    }
    :after{
        content: "";
        bottom: 0;
        height: 2px;
        left: 50%;
        top:20px;
        position: absolute;
        background: var(--white);
        transition: width 0.3s ease 0s, left 0.3s ease 0s;
        width: 0;

        @media (max-width:1000px){
            top:50%;
        }
    }
    :hover:after{
        width:100%;
        left:0;
    }

    :hover a {
        color:var(--orange)
    }
    
    a{
        color:var(--white);
        text-decoration:none;
        transition:all 300ms ease;
        cursor:pointer;
    }
`

const NavResume = styled.div`
    display:flex;
    justify-content:center;
    align-items:center;
    animation:drop 2s ease;
    margin-left:20px;

    @media (max-width:1000px){
        margin:0;
    }
`

const BurgerWrapper = styled.div`
    display:none;
    cursor:pointer;
    font-size:25px;
    transition:300ms ease-in-out;

    @media (max-width: 1000px){
        display:block;
    }

    @media (max-width:600px){
        font-size:20px;
    }
    :hover{
        color:var(--darkest-gray);
    }

`

export default Header
