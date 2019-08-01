import React from 'react';
import { BeatLoader } from 'react-spinners';

export default function Loader (props) {

	if (props.loading)
		return (
			<div style={{display:'flex', justifyContent:'center', padding: '5px'}}>
				<BeatLoader 
				  sizeUnit={"px"}
				  size={10}
				  color={'#C1464E'}
				/>
			</div>
		)
	return null;
}