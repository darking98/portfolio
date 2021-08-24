import ticTacToe from '../images/tic-tac-toe.png'
import weather from '../images/api-weather-screen.jpg'
import quiz from '../images/quiz-app.png'
import superheroe from '../images/superhero.png'
import twitterClone from '../images/twitter-clone.png'
import {FiGithub} from 'react-icons/fi'
import {BiLinkExternal} from 'react-icons/bi'
export const projects = [
    {
        image:twitterClone,
        title:'Twitter Clone',
        info:'Es un clon de <a href="https://www.twitter.com/" target="_blank">Twitter</a> copiando la UI con la funcionalidades básicas de twitter como dar like, comentar y tener un perfil propio.',
        technologies:['React Js', 'Firebase', 'Scss/SASS'],
        iconsLinks:[
            {
                icon:<FiGithub/>,
                href:"https://github.com/darking98/twitter-clone"
            },
            {
                icon:<BiLinkExternal/>,
                href:"https://powerful-hollows-33877.herokuapp.com/"
            }
        ]
    },
    {
        image:superheroe,
        title:'SuperHero Team',
        info:'Este es un proyecto hecho para el challenge de <a href="https://www.alkemy.org/" target="_blank">Alkemy</a> en el que consiste crear un buscador de héroes haciendo peticiones a una API y poder selelccionarlos y agregarlos a tu equipo. <div><p>Email : challenge@alkemy.org</p> <p>Password : react</p></div>',
        infoExtra:'Pssst... para poder tener una mejor experiencia de usuario, se recomienda activar CORS desde este <a href="https://cors-anywhere.herokuapp.com/" target="_blank">link.',
        technologies:['React Js', 'Styled Components', 'SuperHeroe API', 'React Router'],
        iconsLinks:[
            {
                icon:<FiGithub/>,
                href:"https://github.com/darking98/alkemy-challenge"
            },
            {
                icon:<BiLinkExternal/>,
                href:"https://darking98.github.io/alkemy-challenge/"
            }
        ]

    },
    {
        image:quiz,
        title:'Quiz App',
        info:'Juego de preguntas y respuestas traidas de <a href="https://opentdb.com/api_config.php" target="_blank">OpenTrivia API</a> en donde el jugador puede seleccionar la categoria y la dificultad de las preguntas.',
        technologies:['React Js', 'Styled Components', 'OpenTrivia Api'],
        iconsLinks:[
            {
                icon:<FiGithub/>,
                href:"https://github.com/darking98/quiz-app"
            },
            {
                icon:<BiLinkExternal/>,
                href:"https://darking98.github.io/quiz-app/"
            }
        ]

    },
    {
        image:weather,
        title:'Weather App',
        info:'Mediante consultas a la api de <a href="https://weatherstack.com/" target="_blank">WeatherStack</a> la aplicacion muestra hora y temperatura del lugar deseado y a su vez, con la api de <a href="https://unsplash.com/" target="_blank">Unsplash</a> despliega una imagen con la ciudad ingresada en tiempo real.',
        infoExtra:'Pssst... para poder tener una mejor experiencia de usuario, se recomienda activar CORS desde este <a href="https://cors-anywhere.herokuapp.com/" target="_blank">link.',
        technologies:['React Js', 'Styled Components', 'Weather Api', 'Unsplash Api'],
        iconsLinks:[
            {
                icon:<FiGithub/>,
                href:"https://github.com/darking98/weather-api"
            },
            {
                icon:<BiLinkExternal/>,
                href:"https://darking98.github.io/weather-api/"
            }
        ]

    },
    {
        image:ticTacToe,
        title:'Tic-Tac-Toe',
        info:'El típico juego Tic-Tac-Toe hecho en Javascript Vanilla para poner en práctica mis conocimientos de lógica y programación.',
        technologies:['Javascript', 'Scss/SASS'],
        iconsLinks:[
            {
                icon:<FiGithub/>,
                href:"https://github.com/darking98/tic-tac-toe"
            },
            {
                icon:<BiLinkExternal/>,
                href:"https://darking98.github.io/tic-tac-toe/"
            }
        ]

    }
]