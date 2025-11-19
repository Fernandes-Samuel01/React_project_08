import React, { useState, useEffect } from "react";
import { Container, PostCard } from "../components";
import appwriteService from "../appwrite/config"

function AllPosts() {
    const [posts, setPosts] = useState([])

    //Here we fetch all posts so that we can display them in the AllPosts page. We use useEffect to call the getPosts method from appwriteService when the component mounts. The fetched posts are then stored in the posts state using setPosts. 
    //We pass an empty array as the first argument to getPosts to indicate that we want to fetch all posts without any filters.
    useEffect(() => {
        appwriteService.getPosts([])
            .then((posts) => {
                if (posts) {
                    setPosts(posts.documents)
                }
            })
    }, [])

    return (
        <div className="w-full py-8">
            <Container>
                <div className="flex flex-wrap">
                    {posts.map((post) => (
                        <div key={post.$id} className="p-2 w-1/4">
                            <PostCard post={post} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default AllPosts;