import { Outlet } from 'react-router-dom';
import { Container, Separator, Theme } from '@radix-ui/themes';

import Navbar from './Navbar';

import './App.css';

const App = () => {
  return (
    <>
      <Theme accentColor="crimson">
        <Container
          role="navigation"
          size="4"
          pt="3"
          px="2"
        >
          <Navbar />
        </Container>
        <Separator
          my="3"
          size="4"
        />
      </Theme>
      <Container
        size="4"
        px="3"
        pb="4"
      >
        <Outlet />
      </Container>
    </>
  );
};

export default App;
