import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import Page from '@demo/components/Page';
import store from '@demo/store';
import '@demo/styles/common.scss';
//import { history } from './utils/history';
//import Home from '@demo/pages/Home';

import loading from '../src/images/loading.svg';

const Editor = React.lazy(() => import('@demo/pages/Editor'));

function App() {
  return (
    <Provider store={store}>
      <Page>
        <Suspense
          fallback={
            <div
              style={{
                width: '100vw',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                width='200px'
                src={
                    process.env.NODE_ENV === "production" ?
                        './loading.svg'
                        : loading
                }
                alt=''
              />
              <p
                style={{
                  fontSize: 24,
                  color: 'rgba(0, 0, 0, 0.65)',
                }}
              >
                Please wait a moment.
              </p>
            </div>
          }
        >
          <BrowserRouter basename="/">
              <Editor />
          </BrowserRouter>
        </Suspense>
      </Page>
    </Provider>
  );
}

export default App;
