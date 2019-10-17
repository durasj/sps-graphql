import React from 'react';
import { createClient, Provider } from 'urql';

import './App.css';
import Maps from './Maps';

const client = createClient({
  url: 'https://www.graphqlhub.com/graphql',
});

function App() {
  return (
    <Provider value={client}>
      <div className="App">
        <header className="App-header">
          <h1>These are the hottest maps</h1>
          <Maps />
        </header>
      </div>
    </Provider>
  );
}

export default App;
