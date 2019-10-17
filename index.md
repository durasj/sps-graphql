---
layout: default
title: Prezentácia
---

## Motivácia

Nemôžeme našu aplikáciu odizolovať od zvyšku sveta. Potrebujeme komunikovať s cudzími službami. Spôsoby akými sme to umožnili sa rôznia (TODO: link na REST APIs dvoch rôznych gigantov). GraphQL to zjednocuje a berie o úroveň vyššie.

TODO: Zostrih silno motivačného videa.

## Získavanie informácií z cudzích GraphQL APIs

Existujú APIs vytvorené priamo len na GraphQL, ale existujú aj "proxies", ktoré obaľujú existujúce APIs. Vyhneme sa uzatvoreným a pozrieme sa na niektoré z otvorených: https://github.com/APIs-guru/graphql-apis

Na hranie použijeme [GraphQL Hub Playground](https://www.graphqlhub.com/playground?query=%23%20Hit%20the%20Play%20button%20above!%0A%23%20Hit%20%22Docs%22%20on%20the%20right%20to%20explore%20the%20API%0A%0A%7B%0A%7D%0A).

Skúsime získať informácie o používateľovi redditu:

```graphql
{
  reddit {
    user(username: "GovSchwarzenegger") {
      username
      commentKarma
      createdISO
    }
}
```

... a môžeme nick skúsiť zameniť za "Here_Comes_The_King".

My máme ale veľmi VEĽMI radi mapy a spolu s ďalšími ich hľadáme a zbierame a preto ideme nájsť niečo o nich.


```graphql
{
  reddit 
    subreddit(name: "MapPorn"){
      hotListings(limit: 5) {
        title
        url
        score
        comments(limit: 3) {
          body
          author { 
            username
            commentKarma
          }
        }
      }
    }    maps: async () => {
        const query = `{
            reddit {
              subreddit(name: "MapPorn") {
                hotListings(limit: 5) {
                  title
                  url
                  score
                }
              }
            }
        }`;

        const data = await request('https://www.graphqlhub.com/graphql', query);

        return data.reddit.subreddit.hotListings;
    },
}
```

A môžeme sa ešte pohrať s niečím iným.

## Získavanie informácií do Reactu z cudzích GraphQL APIs 

Appka s mapami je TOP a naposledy sme robili React.

```
npx create-react-app hot-maps
cd hot-maps
npm start
```

Potrebujeme ešte knižnicu na prácu so serverom: `npm install urql graphql`.

Môžeme si vytvoriť klienta čo nás "napojí na server" vo všetký komponentoch nižšie.

```jsx
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
```

A vytvoríme nový komponent `Maps`, ktorý bude robiť výber dát a zobrazí ich:

```jsx
import React from 'react';
import { useQuery } from 'urql';

export default function Maps () {
    const [result] = useQuery({
        query: `{
            reddit {
              subreddit(name: "MapPorn"){
                hotListings(limit: 5) {
                  title
                  url
                  score
                  comments(limit: 3) {
                    body
                    author { 
                      username
                      commentKarma
                    }
                  }
                }
              }
            }
        }`,
    });

    const { fetching, data } = result;
    const maps =
        data
        ? data.reddit.subreddit.hotListings
        : [];

    const mapsList = maps.map(map => (
        <div>
            <h3>{map.title}</h3>
            <img src={map.url} alt={map.title} width="50%" />
            <p>Score: {map.score}</p>
            <hr />
        </div>
    ));

    return (
        <div>
            {fetching ? 'loading...' : mapsList}
        </div>
    );
}
```

## Vlastné GraphQL API

GraphQL API nemusíme len konzumovať ale môžeme aj vytvoriť pre naše potreby (alebo druhých). Môžeme zostať v priečinku s react aplikáciou a vytvoríme v ňom aj server.

Na to potrebujeme zopár balíkov: `npm install graphql express express-graphql cors`.

Základ servera je:

```js
const express = require('express');
const express_graphql = require('express-graphql');
const { buildSchema } = require('graphql');
const cors = require('cors');

const schema = buildSchema(`
    type Query {
        message: String
    }
`);
const root = {
    message: () => 'Hello World!'
};
const app = express();
app.use(cors());

app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

app.listen(
    4000,
    () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'),
);
```

A spustíme ho pomocou `node server.js`. Mozeme otvorit [localhost:4000/graphql](http://localhost:4000/graphql).

Na nasom serveri sa mozeme dostat k hodnotam rozne, napr. aj ziskanim z ineho GraphQL servera. Na to chceme vytvorit klienta s balickom, ktory si nainstalujeme: `npm install graphql-request`.

Na server pridame type Map a resolver na maps.

```js
const schema = buildSchema(`
    type Map {
        title: String!
        url: String!
        score: String!
    }

    type Query {
        message: String
        maps: [Map!]!
    }
`);
```


```js
    maps: async () => {
        const query = `{
            reddit {
              subreddit(name: "MapPorn") {
                hotListings(limit: 5) {
                  title
                  url
                  score
                }
              }
            }
        }`;

        const data = await request('https://www.graphqlhub.com/graphql', query);

        return data.reddit.subreddit.hotListings;
    },
```

A klienta upravime podla toho. Finalny kod v repozitari.

## Ďalšie úlohy (na doma?)

1. Skúste iné API zo [zoznamu](https://github.com/APIs-guru/graphql-apis), ktoré vás zaujíma a má možnosť odkskúšania v prehliadači a napíšte zopár queries na čítanie dát.
2. Doplnte na server do schemy a resolvera komentare.
3. Pridajte zobrazovanie komentarov na klienta.
