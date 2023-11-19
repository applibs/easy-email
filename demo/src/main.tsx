import React from 'react';
import App from './App';
import * as ReactDOMClient from 'react-dom/client';

// @ts-ignore
let root: ReactDOMRoot = null;

// @ts-ignore
window.createEmailBuilder = () => {
  const container = document.getElementById('root');
  if(container) {
    root = ReactDOMClient.createRoot(container);
    root.render(<App />);
  } else {
    console.log('not container');
  }
}

if (process.env.NODE_ENV !== "production") {
  // @ts-ignore
  window.createEmailBuilder();
}

// @ts-ignore
window.destroyEmailBuilder = () => {
  const container = document.getElementById('root');
  if(root && container) {
    root.unmount();
  }
}