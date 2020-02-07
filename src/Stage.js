import React from 'react';

const stageStyles = {
	marginTop: '4em'
};

const Stage = ({ children }) => {
	return <div style={stageStyles}>{children}</div>;
};

export default Stage;
