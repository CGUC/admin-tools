import styled from 'styled-components'

export const Card = styled.div`
	background: #FFFFFF;
	border: 0.5px solid #ABABAB;
	box-sizing: border-box;
	box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
	border-radius: 4px;
	padding: 30px 40px 30px 40px;

	display: flex;
	flex-direction: column;

	max-width: ${props => props.width};
	height: ${props => props.height};
	margin-bottom: ${props => props.marginBottom};

`

export const CardHeader = styled.div`
	font-size: 30px;
	margin-bottom:10px;
`

export const CardDescription = styled.div`
	font-size: 15px;
	margin-bottom: 10px;
`