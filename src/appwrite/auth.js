import conf from '../conf/conf.js';
import { Client, Account, ID } from "appwrite";

export class AuthService {

    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl) // Your API Endpoint
            .setProject(conf.appwriteProjectId); // Your project ID
        this.account = new Account(this.client);
    }

    //create account and login
    async createAccount({ email, password, name }) {
        try {
            const userAccount = await this.account.create({
                userId: ID.unique(),
                email: email,
                password: password,
            });
            if (name) {
                //update the user name
                await this.account.updateName(name);
            }
            if (userAccount) {
                //call another method, if user account is created successfully then directly let the user login
                return this.login({ email, password });
            } else {
                return userAccount;
            }
        } catch (error) {
            console.log("Appwrite Service :: createAccount :: error ", error);
            throw error;
        }
    }

    //login method
    async login({ email, password }) {
        try {
            return await this.account.createEmailPasswordSession({email, password});
        } catch (error) {
            console.log("Appwrite Service :: login :: error ", error);
            throw error;
        }
    }

    //get current logged in user
    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            console.log("Appwrite Service :: getCurrentUser :: error ", error);
        }
        return null;
    }

    //logout method
    async logout() {
        try {
            return await this.account.deleteSessions();
        } catch (error) {
            console.log("Appwrite Service :: logout :: error ", error);
        }
    }
}

const authService = new AuthService();

export default authService;

//Note : Whenever we have some project using Appwrite as backend, we can use this AuthService class to manage user authentication related tasks.
// It provides methods to create accounts, login, get the current user, and logout, making it easier to integrate Appwrite authentication into our application.
// We can expand this class further by adding more functionalities as needed, such as password reset, email verification, etc.
//It is ready to use in our application wherever user authentication is required.