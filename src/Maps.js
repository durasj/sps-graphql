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
