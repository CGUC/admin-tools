import styled from 'styled-components'

export const Button = styled.button`
  background: ${props => props.primary ? "var(--primary-color)" : "white"};
  color: ${props => props.primary ? "white" : "var(--primary-color)"};

  font-size: 1em;
  margin: ${props => props.margin || '2px'};
  padding: 10px 20px 10px 20px;
  border: 2px solid var(--primary-color);
  border-radius: 5px;
  cursor: pointer;
  width: ${props => props.width}
`;