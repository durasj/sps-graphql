const express = require('express');
const express_graphql = require('express-graphql');
const { buildSchema } = require('graphql');
const cors = require('cors');
const { request } = require('graphql-request');

const schema = buildSchema(`
    type Author {
        username: String!
    }

    type Comment {
        author: Author!
        body: String
    }

    type Map {
        title: String!
        url: String!
        score: String!
        comments: [Comment!]!
    }

    type Query {
        message: String
        maps: [Map!]!
    }
`);
const root = {
    message: () => 'Hello World!',
    maps: async () => {
        const query = `{
            reddit {
              subreddit(name: "Awww") {
                hotListings(limit: 5) {
                  title
                  url
                  score
                  comments {
                      author {
                          username
                      }
                      body
                  }
                }
              }
            }
        }`;

        try {
            const data = await request('https://www.graphqlhub.com/graphql', query);

            return data.reddit.subreddit.hotListings;
        } catch (e) {
            console.error(e);
        }
    },
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
