"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import NavigationButton from "./NavigationButton";

interface FormData {
  username: string;
  email: string;
  password: string;
}

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const { username, email, password } = data;
      const res = await fetch("http://localhost:3000/api/auth/v1/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!res.ok) {
        let errorMessage = `Error ${res.status}: ${res.statusText}`;
        switch (res.status) {
          case 400:
            errorMessage = "Error 400: User already exists";
            break;
          case 500:
            errorMessage = "Error 500: Internal server error";
            break;
        }
        console.error(errorMessage);
        return;
      }

      let responseData: { message?: string } | null = null;
      try {
        responseData = await res.json();
      } catch (jsonError) {
        console.error("Error parsing response JSON:", jsonError);
      }

      if (responseData?.message) {
        console.log("Registration successful:", responseData.message);
      } else {
        console.log("Registration successful but no message received.");
      }
    } catch (error) {
      if (error instanceof TypeError) {
        console.error("Network error or CORS issue:", error.message);
      } else if (error instanceof Error) {
        console.error("Unexpected error:", error.message);
      } else {
        console.error("Unknown error occurred:", error);
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center text-[#2C3930] bg-gradient-to-r from-light-beige to-dark-green">
      <div className="w-full max-w-md p-8 space-y-6 bg-gradient-to-r from-light-beige to-dark-green shadow-lg rounded-2xl">
        <h2 className="text-center text-2xl font-bold">Register</h2>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            placeholder="Username"
            {...register("username", { required: "Username is required" })}
            className="w-full border-[#2C3930] p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.username && (
            <span className="text-red-500">{errors.username.message}</span>
          )}

          <input
            type="email"
            placeholder="Email"
            {...register("email", { required: "Email is required" })}
            className="w-full  p-3 border border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <span className="text-red-500">{errors.email.message}</span>
          )}

          <input
            type="password"
            placeholder="Password"
            {...register("password", { required: "Password is required" })}
            className="w-full border-black p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && (
            <span className="text-red-500">{errors.password.message}</span>
          )}

          <button
            type="submit"
            className="w-full bg-[#A27B5C] text-[#2C3930] p-3 rounded-xl hover:bg-[#3F4F44] focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="text-center flex justify-center">
          Already have an account? <NavigationButton route="login" />
        </p>
      </div>
    </div>
  );
}
