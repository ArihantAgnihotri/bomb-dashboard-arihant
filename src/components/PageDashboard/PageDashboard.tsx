import React from 'react';
import {Container} from '@material-ui/core';
import useEagerConnect from '../../hooks/useEagerConnect';

const PageDashboard: React.FC = ({children}) => {
  useEagerConnect();
  return (
    <div style={{position: 'relative', minHeight: '100vh'}}>
      <Container maxWidth="lg" style={{paddingBottom: '5rem'}}>
        {children}
      </Container>
    </div>
  );
};

export default PageDashboard;
