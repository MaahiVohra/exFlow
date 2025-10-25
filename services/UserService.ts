import { toast } from "@/hooks/use-toast";

const userBasePath = "/api/user";

export async function getUserDetails() {
  try {
    const response = await fetch(userBasePath);
    if (!response.ok) throw new Error("Failed to fetch user");
    return (await response.json()) as User;
  } catch (error) {
    console.error("Error fetching user:", error);
    toast({
      title: "Error",
      description: "Failed to load user. Please try again.",
      variant: "destructive",
    });
  }
}
