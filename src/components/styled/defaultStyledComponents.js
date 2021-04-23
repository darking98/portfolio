import styled from 'styled-components'

export const Button = styled.button`
    padding: ${props => props.padding};
    background-color: transparent;
    border:1px solid var(--orange);
    color:var(--orange);
    cursor:pointer;
    transition:all 300ms ease-in-out;
    border-radius:5px;
    text-transform:capitalize;
    font-size:15px;
    font-family:"SF Mono";
    font-weight:100;

    :hover{
        background-color: var(--orange);
        color:var(--black)
    }
`

