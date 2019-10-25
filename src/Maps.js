import React from 'react';
import { useQuery } from 'urql';

export default function Maps () {
    const [result] = useQuery({
        query: `{
          maps {
            title
            url
            score
            comments
          }
        }`,
    });

    const { fetching, data } = result;
    const maps = data ? data.maps : [];

    const mapsList = maps.map(map => (
        <div key={map.title}>
            <h3>{map.title}</h3>
            <img src={map.url} alt={map.title} width="50%" />
            <p>Score: {map.score}</p>
            <ul>
                {map.comments.map(
                    comment => (<li>{comment.body}</li>)
                )}
            </ul>
            <hr />
        </div>
    ));

    return (
        <div>
            {fetching ? 'loading...' : mapsList}
        </div>
    );
}
