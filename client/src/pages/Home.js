import React, { useContext } from "react";
import { useQuery } from "@apollo/client";
import { Grid } from "semantic-ui-react";

import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import { AuthContext } from "../context/auth";
import { FETCH_POSTS_QUERY } from "../util/graphql";

export default function Home() {
    const { user } = useContext(AuthContext);
    const { loading, data } = useQuery(FETCH_POSTS_QUERY);

    return (
        <Grid columns={3}>
            <Grid.Row className="page-title">
                <h1>Recent Posts</h1>
            </Grid.Row>
            <Grid.Row>
                {user && (
                    <Grid.Column>
                        <PostForm />
                    </Grid.Column>
                )}
                {loading ? (
                    <h1>Loading ...</h1>
                ) : (
                    data.getPosts &&
                    data.getPosts.map((post, idx) => (
                        <Grid.Column key={idx} style={{ marginBottom: "20px" }}>
                            <PostCard post={post}></PostCard>
                        </Grid.Column>
                    ))
                )}
            </Grid.Row>
        </Grid>
    );
}
