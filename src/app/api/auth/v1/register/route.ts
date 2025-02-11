import { prisma } from "@/utils/db/prisma";
import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

// Constants for error messages and status codes
const ERROR_MESSAGES = {
  MISSING_FIELDS: "Missing fields",
  USER_EXISTS: "User already exists",
  INTERNAL_ERROR: "Internal Server Error",
};

const STATUS_CODES = {
  BAD_REQUEST: 400,
  CREATED: 201,
  INTERNAL_SERVER_ERROR: 500,
};

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json();

    // Validate required fields
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.MISSING_FIELDS },
        { status: STATUS_CODES.BAD_REQUEST }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.USER_EXISTS },
        { status: STATUS_CODES.BAD_REQUEST }
      );
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create the user
    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    // Return success response
    return NextResponse.json(
      { message: "User created successfully", success: true, user },
      { status: STATUS_CODES.CREATED }
    );
  } catch (error) {
    console.error("Error in POST /api/register:", error);

    // Return error response
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR, message: error.message },
      { status: STATUS_CODES.INTERNAL_SERVER_ERROR }
    );
  }
}
