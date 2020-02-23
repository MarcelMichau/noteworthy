import React from 'react';
import { Container } from 'semantic-ui-react';

const stageStyles = {
	marginTop: '4em'
};

const Stage = ({ children }) => {
	return <Container style={stageStyles}>{children}</Container>;
};

export default Stage;
