import { Inngest } from "inngest";
import {connectDB} from "./db.js";
//import { User } from "../models/user.model.js"
// ...existing code...
//import { inngest, functions } from './config/inngest.js'; // Corrected path
// ...existing code...

// Create a client to send and receive events
export const inngest = new Inngest({ id: "slack-clone" });

const syncuser = inngest.createFunction(
    {id: "sync/user"},
    {event: "clerk/user.created"},
    async ({event}) => {
        await connectDB();
        const {id , email_addresses , first_name , last_name , image_url} = event.data
        const newUser = {
            clerkId:id,
            email: email_addresses[0]?.email_addresses,
            name: `${first_name || ""} ${last_name || "" }`,
            image: image_url,
        }
        await User.create (newUser)
    }
);
const deleteUserFromDB = inngest.createFunction(
{id: "delete-user-from-db"},
{event: "clerk/user.delete"},
async ({event}) => {
    await connectDB();
    const{id} = event.data;
    await User.deleteOne({clerkId: id});
    

}
)
// Create an empty array where we'll export future Inngest functions
export const functions = [syncuser, deleteUserFromDB];