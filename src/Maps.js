import React from 'react';
import { useQuery } from 'urql';

export default function Maps () {
    const [result] = useQuery({
        query: `{
          maps {
            title
            url
            score
          }
        }`,
    });

    const { fetching, data } = result;
    const maps = data ? data.maps : [];

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
