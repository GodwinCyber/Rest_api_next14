import connect from "@/lib/db";
import User from "@/lib/modals/users";
import Category from "@/lib/modals/category";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

export const GET = async (request: Request) => {
    try {

        //search the url and get the userId
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing userId" }), { status: 400, });
        }

        // connect to the database
        await connect();

        //return User by userId
        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse(JSON.stringify({ message: "User not found in the database" }), { status: 400 });
        }

        // find categories by userId. user id that is passed by the client and userId that is passed by database.
        const categories = await Category.find({ user: new Types.ObjectId(userId) });

        return new NextResponse(JSON.stringify(categories), { status: 200, });
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ message: "Error in featching categories" + error.message }), { status: 500 });
    }
};

export const POST = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        const { title } = await request.json();

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing userId" }), { status: 400 });
        }

        await connect();

        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse(JSON.stringify({ message: "User not found in the database" }), { status: 400 });   
        }
        const newCategory = new Category({
            title,
            user: new Types.ObjectId(userId),
        });
        await newCategory.save();

        return new NextResponse(JSON.stringify({ message: "Category is created", category: newCategory }), { status: 200, });

    } catch (error: any) {
        return new NextResponse(JSON.stringify({ message: "Error in creating category" + error.message }), { status: 500 });
    }
}