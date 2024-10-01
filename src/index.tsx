import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Theme } from '@radix-ui/themes';

import App from './App';
import Home from './pages/Home';
import Contact from './pages/Contact';
import NoPage from './pages/NoPage';
import Filetree from './pages/Filetree';
import Synergy from './pages/Synergy';
import Instructify from './pages/Instructify';
import Cards from './pages/Cards';

import 'normalize.css';
import '@radix-ui/themes/styles.css';

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <Theme
        accentColor="iris"
        grayColor="olive"
        radius="full"
        appearance="dark"
        scaling="95%"
      >
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={<App />}
            >
              <Route
                index
                element={<Home />}
              />
              <Route
                path="/contact"
                element={<Contact />}
              />
              <Route
                path="/synergy"
                element={<Synergy />}
              />
              <Route
                path="/instructify"
                element={<Instructify />}
              />
              <Route
                path="/filetree"
                element={<Filetree />}
              />
              <Route
                path="/cards"
                element={<Cards />}
              />
              <Route
                path="*"
                element={<NoPage />}
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </Theme>
    </React.StrictMode>
  );
}
