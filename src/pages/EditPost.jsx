import React, { useState, useEffect } from "react";
import appwriteService from "../appwrite/config"
import { Container, PostForm } from "../components"
import { useNavigate, useParams } from "react-router-dom";

function EditPost() {
    const [post, setPosts] = useState([])
    const { slug } = useParams();
    const navigate = useNavigate();

    //in getPosts we will pass the slug to get the post by slug and set it to the state. This is done because we need to edit the post.
    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug)
                .then((post) => {
                    if (post) {
                        setPosts(post);
                    }
                })
        }
        else {
            navigate("/");
        }
    }, [slug, navigate]);

    return post ? (
        <div className="py-8">
            <Container>
                <PostForm post={post}/>
            </Container>
        </div>
    ) : null
}

export default EditPost;