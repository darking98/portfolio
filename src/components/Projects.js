import React from "react";
import styled from "styled-components";
import { projects } from "../config/projects";
const Projects = () => {
  return (
    <Container id="projects">
      <HeaderContainer>
        <h2>Mis proyectos</h2>
      </HeaderContainer>
      {projects.map((project) => (
        <ProjectsWrapper>
          <ImageWrapper>
            <a
              href={project.iconsLinks[1].href}
              target="_blank"
              rel="noreferrer"
            >
              <img src={project.image} alt="" width="500px" />
            </a>
          </ImageWrapper>
          <InfoWrapper>
            <HeaderInfo>
              <h3>{project.title}</h3>
            </HeaderInfo>
            <TextInfo>
              <p dangerouslySetInnerHTML={{ __html: project.info }} />
              <span dangerouslySetInnerHTML={{ __html: project.infoExtra }} />
            </TextInfo>
            <TechnologiesUsed>
              {project.technologies.map((element) => (
                <h4>{element}</h4>
              ))}
            </TechnologiesUsed>
            <IconsLink>
              {project.iconsLinks.map((element) => (
                <a href={element.href} target="_blank" rel="noreferrer">{element.icon}</a>
              ))}
            </IconsLink>
          </InfoWrapper>
        </ProjectsWrapper>
      ))}
      
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr 2fr 1fr;
  gap: 20px 10px;
  grid-template-rows: fit-content(80px);
  margin-top: 200px;
`;
const HeaderContainer = styled.div`
  grid-column: 2 / span 4;
  h2 {
    color: var(--white);
    font-size: 30px;
    font-weight: 600;
    letter-spacing: 1px;
    position: relative;
    :after {
      content: "";
      height: 1px;
      background-color: var(--darkest-gray);
      width: 450px;
      position: absolute;
      left: 200px;
      top: 40%;
      color: white;

      @media (max-width: 1180px) {
        width: 40%;
      }

      @media (max-width: 600px) {
        width: 20%;
      }
    }
  }
`;

const ProjectsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  width: 100%;
  justify-content: space-between;
  grid-column: 2 / span 2;

  @media (max-width: 1180px) {
    display: flex;
    flex-direction: column;
  }
`;
const ImageWrapper = styled.div`
  @media (max-width: 1180px) {
    align-self: center;
  }
  img {
    filter: grayscale(100%);
    transition: 300ms ease-in-out;

    @media (max-width: 1180px) {
      width: 100%;
    }
    :hover {
      filter: none;
    }
  }
`;

const InfoWrapper = styled.div`
  grid-column: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;

  @media (max-width: 1180px) {
    align-items: flex-start;
  }
`;

const HeaderInfo = styled.div`
  h3 {
    font-size: 28px;
    color: var(--white);
    transition: 300ms ease-in-out;
    :hover {
      color: var(--orange);
    }
  }
`;

const TextInfo = styled.div`
  padding: 20px;
  background-color: var(--lightest-black);
  box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.75);
  color: var(--lightest-gray);
  @media (min-width: 1200px) {
    margin-left: -100px;
    z-index: 99;
  }
  a {
    color: var(--orange);
    text-decoration: none;
    transition: 300ms ease-in-out;
    :hover {
      color: var(--darkest-gray);
    }
  }
  span {
    display: block;
    opacity: 0.65;
    font-size: 18px;
  }
  p {
    font-size: 20px;

    @media (max-width: 600px) {
      font-size: 15px;
    }
  }
`;

const TechnologiesUsed = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  font-family: "SF Mono";
  padding-top: 20px;
  flex-wrap: wrap;
  h4 {
    font-weight: 100;
    font-size: 12px;
    color: var(--white);
    padding-top: 20px;
  }
`;

const IconsLink = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding-top: 20px;
  @media (max-width: 1180px) {
    justify-content: flex-start;
  }
  a {
    color: var(--white);
    text-decoration: none;
    svg {
      margin-left: 20px;
      font-size: 20px;
      transition: 300ms ease-in-out;
      :hover {
        color: var(--orange);
      }
    }
  }
`;
export default Projects;
