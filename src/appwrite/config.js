import conf from '../conf/conf.js';
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service {
    Client = new Client();
    databases;
    bucket;

    constructor() {
        this.Client
            .setEndpoint(conf.appwriteUrl) // Your API Endpoint
            .setProject(conf.appwriteProjectId); // Your project ID
        this.databases = new Databases(this.Client);
        this.bucket = new Storage(this.Client);
    }

    //create a new post
    async createPost({ title, slug, content, featuredImage, status, userId }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId
                }
        )
        } catch (error) {
            console.log("Appwrite Service :: createPost :: error ", error);
        }
    }

    //update an existing post
    async updatePost(slug, { title, content, featuredImage, status }) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug || ID.unique(),
                {
                    title,
                    content,
                    featuredImage,
                    status
                }
            )
        } catch (error) {
            console.log("Appwrite Service :: updatePost :: error ", error);
        }
    }

    //delete a post
    async deletePost(slug) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug || ID.unique()
            )
            return true;
        } catch (error) {
            console.log("Appwrite Service :: deletePost :: error ", error);
            return false;
        }
    }

    //get a single post
    async getPost(slug) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )
        } catch (error) {
            console.log("Appwrite Service :: getPost :: error ", error);
            return false;
        }
    }

    //get multiple posts
    async getPosts(queries = [Query.equal("status", "active")]) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries
            )
        } catch (error) {
            console.log("Appwrite Service :: getPosts :: error ", error);
            return false;
        }
    }

    //upload file to bucket
    async uploadFile(file) {
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            )
        }
        catch (error) {
            console.log("Appwrite Service :: uploadFile :: error ", error);
            return false;
        }
    }

    //delete file from bucket
    async deleteFile(fileId) {
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            )
            return true;
        } catch (error) {
            console.log("Appwrite Service :: deleteFile :: error ", error);
            return false;
        }
    }

    //get file preview url
    getFilePreview(fileId) {
        return this.bucket.getFilePreview(
            conf.appwriteBucketId,
            fileId
        )
    }

}

const service = new Service();

export default service;
