import styled from 'styled-components'

export const Button = styled.button`
  /* Adapt the colors based on primary prop */
  background: ${props => props.primary ? "var(--primary-color)" : "white"};
  color: ${props => props.primary ? "white" : "var(--primary-color)"};

  font-size: 1em;
  margin: ${props => props.margin || '2px'};
  padding: 10px 20px 10px 20px;
  border: 2px solid var(--primary-color);
  border-radius: 3px;
  width: ${props => props.width}
`;