import { NextResponse } from "next/server";
import { Types } from "mongoose";
import connect from "@/lib/db";
import User from "@/lib/modals/users";
import Blog from "@/lib/modals/blog";
import Category from "@/lib/modals/category";


export const GET = async (request: Request, context: { params: any }) => {

    // blogId will be passed from the client side
    const blogId = context.params.blog;
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const categoryId = searchParams.get("categoryId");

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing userId" }), { status: 400 });
        }
        if (!categoryId ||!Types.ObjectId.isValid(categoryId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing categoryId" }), { status: 400 });
        }
        if (!blogId || !Types.ObjectId.isValid(blogId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing blogId" }), { status: 400 });
        }

        await connect();
        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse(JSON.stringify({ message: "User not found" }), { status: 404 });
        }

        const category = await Category.findById(categoryId);
        if (!category) {
            return new NextResponse(JSON.stringify({ message: "Categpory not found" }), { status: 404 });
        }

        // return a single blog using Blog as the model
        const blog = await Blog.findOne({
            _id: blogId,
            user: new Types.ObjectId(userId),
            category: new Types.ObjectId(categoryId),
        });

        if (!blog) {
            return new NextResponse(JSON.stringify({ message: "Blog not found" }), { status: 404, });
        }

        return new NextResponse(JSON.stringify({ blog }), { status: 200 });

    } catch (error: any) {
        return new NextResponse(JSON.stringify({ message: "Error getting blog" + error.message }), { status: 500 });
    }
}
