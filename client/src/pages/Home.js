import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Grid } from "semantic-ui-react";

import PostCard from "../components/PostCard";

export default function Home() {
    const {
        loading,
        data: { getPosts: posts },
    } = useQuery(FETCH_POSTS_QUERY);
    if (posts) {
        console.log(posts);
    }
    return (
        <Grid columns={3}>
            <Grid.Row className="page-title">
                <h1>Recent Posts</h1>
            </Grid.Row>
            <Grid.Row>
                {loading ? (
                    <h1>Loading ...</h1>
                ) : (
                    posts &&
                    posts.map((post, idx) => (
                        <Grid.Column key={idx} style={{ marginBottom: "20px" }}>
                            <PostCard post={post}></PostCard>
                        </Grid.Column>
                    ))
                )}
            </Grid.Row>
        </Grid>
    );
}

const FETCH_POSTS_QUERY = gql`
    {
        getPosts {
            id
            body
            createdAt
            username
            likeCount
            likes {
                username
            }
            commentCount
            comments {
                id
                username
                createdAt
                body
            }
        }
    }
`;
