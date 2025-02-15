import { toast } from "@/hooks/use-toast";

const authBasePath = "/api/auth";

export async function login(loginRequest: LoginRequest) {
  try {
    const response = await fetch(authBasePath + "/login", {
      method: "POST",
      body: JSON.stringify(loginRequest),
      headers: {
        "Content-type": "application/json",
      },
    });
    if (!response.ok) throw new Error("Failed to login");
    return (await response.json()) as User;
  } catch (error) {
    console.error("Error logging in user:", error);
    toast({
      title: "Error",
      description: "Failed to login user. Please try again.",
      variant: "destructive",
    });
  }
}

export async function register(registerRequest: RegisterRequest) {
  try {
    const response = await fetch(authBasePath + "/register", {
      method: "POST",
      body: JSON.stringify(registerRequest),
      headers: {
        "Content-type": "application/json",
      },
    });
    if (!response.ok) throw new Error("Failed to register");
    return (await response.json()) as User;
  } catch (error) {
    console.error("Error creating an account:", error);
    toast({
      title: "Error",
      description: "Failed to register user. Please try again.",
      variant: "destructive",
    });
  }
}
