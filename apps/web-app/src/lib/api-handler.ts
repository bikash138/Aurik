import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "./exceptions/api.error";
import { ErrorCode } from "./exceptions/error.types";

type RouteHandler = (
  req: NextRequest,
  context: any,
) => Promise<NextResponse> | NextResponse;

export function asyncHandler(handler: RouteHandler) {
  return async (req: NextRequest, context: any) => {
    try {
      return await handler(req, context);
    } catch (error: any) {
      if (error instanceof ApiError) {
        if (!error.isOperational) {
          console.error("[API_HANDLER_ERROR]", error);
        }
      } else {
        console.error("[API_HANDLER_UNEXPECTED_ERROR]", error);
      }

      if (error instanceof ApiError) {
        return NextResponse.json(
          {
            error: {
              code: error.errorCode,
              message: error.message,
            },
          },
          { status: error.statusCode },
        );
      }

      if (error.code === "P2002") {
        return NextResponse.json(
          {
            error: {
              code: ErrorCode.CONFLICT,
              message: "A resource with this configuration already exists",
            },
          },
          { status: 409 },
        );
      }

      return NextResponse.json(
        {
          error: {
            code: ErrorCode.INTERNAL_SERVER_ERROR,
            message: "An unexpected error occurred",
          },
        },
        { status: 500 },
      );
    }
  };
}
