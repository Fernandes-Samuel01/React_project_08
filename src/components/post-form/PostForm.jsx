import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "../index";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import appwriteService from "../../appwrite/config"

function PostForm({ post }) {

    const navigate = useNavigate();

    const userData = useSelector((state) => state.user.userData);

    const { register, handleSubmit, setValue, getValues, control, watch } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.slug || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });

    // Submit handler: Handles both creating new posts and updating existing ones, including image uploads.
    // - Accepts `data` containing post form information.
    // - If updating a post (`post` exists):
    //     1. Attempts to upload a new image if provided in the form (`data.image[0]`).
    //     2. If an image was uploaded, deletes the previous featured image (to prevent unused files).
    //     3. Updates the existing post in the database, spreading in all form data, and sets the new image ID only if a new image is uploaded.
    //     4. On success, navigates to the updated post page so the user can view changes.
    // - If creating a new post (`post` does not exist):
    //     1. Uploads the image if provided, waiting until upload finishes.
    //     2. After a successful image upload, adds the image’s ID to the form data.
    //     3. Creates the new post in the database with user ID and all data.
    //     4. Navigates to the new post’s page if creation succeeds.
    // - All file uploads and database actions use async/await to handle time-consuming operations cleanly.
    // - The function ensures user is always redirected to the correct post page after submit for a consistent experience.
    const submit = async (data) => {
        if (post) {
            const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null
            if (file) {
                appwriteService.deleteFile(post.featuredImage);
            }
            const dbPost = await appwriteService.updatePost(
                post.$id, {
                ...data,
                featuredImage: file ? file.$id : undefined,
            });
            if (dbPost) {
                navigate(`/post/${dbPost.$id}`);
            }
        }
        else {
            const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null
            if (file) {
                const fileId = file.$id;
                data.featuredImage = fileId;
                const dbPost = await appwriteService.createPost({
                    ...data,
                    userId: userData.$id,
                })
                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            }
        }
    }

    // Replace all characters that are NOT letters, digits, or spaces with a hyphen ("-")
    //   - [^a-zA-Z\d\s]+ : matches one or more characters that are NOT:
    //       lowercase a-z, uppercase A-Z, digits (0-9), or whitespace characters
    // Replace all whitespace characters with a hyphen ("-")
    //   - \s matches any whitespace character (spaces, tabs, line breaks)
    // Essentially, this cleans up a string by converting special characters and spaces into hyphens,
    // which is often used for creating URL-friendly slugs or identifiers.
    const slugtransform = useCallback((value) => {
        if (value && typeof value === "string") {
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");
        }
        return '';
    }, [])

    // This React useEffect hook is created to automate the process of updating the 'slug' field 
    // whenever the 'title' field in a form changes. It sets up a watcher on the form's 'title' input,
    // and when a change is detected, it transforms the title into a URL-friendly slug using the 'slugtransform' function.
    // The effect ensures the 'slug' stays synchronized with the 'title', providing real-time, dynamic updates.
    // It also includes a cleanup function that unsubscribes from the watcher when the component unmounts or dependencies change,
    // preventing memory leaks and unnecessary computations.
    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugtransform(value.title, { shouldValidate: true }));
            }
        })
        return () => {
            subscription.unsubscribe()
        }
    }, [watch, slugtransform, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugtransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={appwriteService.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    )
}

export default PostForm;
