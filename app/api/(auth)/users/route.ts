import connect from "@/lib/db";
import User from "@/lib/modals/users";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

// use the object id passed from the user client is incorrect
const ObjectId = require("mongoose").Types.ObjectId;

//fetch all the user existing in the database
export const GET = async () => {
  try {
    //connect to mongodb db and return all the users
    await connect();
    const users = await User.find();
    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error in fectching users" + error.message, { status: 500 });
  }
};

// POST request wuill be responsible for creating a new user
export const POST = async (request: Request) => {
  try {
    //get the data of the user and the data of a user is get from the body and connect to the database

    const body = await request.json();
    await connect();

    //cressting instance for the user
    const newUser = new User(body);
    await newUser.save();
    return new NextResponse(JSON.stringify({ message: "User is created", user: newUser }),
    { status: 201 }
  );

  } catch (error: any){
    return new NextResponse("Error in fectching users" + error.message, { status: 500 }
    );
  }
};

//API for patch for updating the user details
export const PATCH = async (request: Request) => {
  try {
    //get the id of the user
    const body = await request.json();
    const { userId, newUsername } = body;

    await connect();
    if (!userId || !newUsername) {
      return new NextResponse(JSON.stringify({ message: "ID or new username is not found" }),
      { status: 400 }
    );
    }

    // check the validation of the id
    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "Invalid user id"}), { status: 400 });
    }

    // incase user is not existing in db, find the user
    const updatedUser = await User.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { username: newUsername },
      { new: true }
    );
    if (!updatedUser) {
      return new NextResponse(JSON.stringify({ message: "User is not found in database" }), { status: 400 });
    };
    return new NextResponse(JSON.stringify({ message: "User is updated", user: updatedUser }), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error in fectching users" + error.message, { status: 500 });
  }
};

// Create delete request API
export const DELETE = async (request: Request) => {
  try {
    // first step is to fetch data as search param from the url
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId"); // how to receive the userid from url

    // validate if userid exist or not
    if (!userId) {
      return new NextResponse(JSON.stringify({ message: "ID not found" }), { status: 400 });
    }

    // verify if userid valid or not
    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "Invalid User Id" }), { status: 400 });
    }

    // connect with db
    await connect();

    //once the db is connected, find and delete with id that is receive by url
    const deletedUser = await User.findByIdAndDelete(new Types.ObjectId(userId));

    if (!deletedUser) {
      return new NextResponse(JSON.stringify({ message: "User not found in the database"}), { status: 400 });
    }

    return new NextResponse(JSON.stringify({ message: "User is deleted", user: deletedUser }), { status: 200 });

  } catch (error: any) {  
    return new NextResponse(JSON.stringify({ message: "Error in deleting user", error: error.message }), { status: 500 });
  }
};
