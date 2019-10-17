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
    }
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

TODO: Nainstalovanie balickov, zavesi sa server, vlozi existujuci server a prida favorites.

## Ďalšie úlohy (na doma?)

Od najľahšej po najťažšiu.

1. Skúste iné API zo [zoznamu](https://github.com/APIs-guru/graphql-apis), ktoré vás zaujíma a má možnosť odkskúšania v prehliadači a napíšte zopár queries na čítanie dát.
2. Doplnte do React aplikácie zobrazovanie komentárov k príspevkom.
3. Pridajte odstránenie z obľúbených a vylistovanie len obľúbených na server aj klienta.
