import styled from 'styled-components'

export const Input = styled.input`
	height: 30px;
	width: ${props => props.width};
	padding-left: 10px;
	border: solid 1px grey;
	border-radius: 2px;
`

export const InputLabel = styled.div`
	margin-bottom: 5px;
	font-size: 20px;
`

export const InputGroup = styled.div`
	display: flex;
	flex-direction: column;
	margin-bottom: 20px;
`

export const InputGroupRow = styled.div`
	display: flex;
	flex-direction: row;
	margin-bottom: 0px;
	align-items: center;
`