"use client";

import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import UserAvatar from "@/components/UserAvatar";
import { login, register } from "@/services/AuthService";
import { getUserDetails } from "@/services/UserService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = loginSchema.extend({
  name: z.string().min(3, "User name must be at least 3 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

enum AUTH_TABS {
  LOGIN = "login",
  REGISTER = "register",
}

export default function Navbar() {
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(AUTH_TABS.LOGIN);
  const [user, setUser] = useState<User>();

  const form = useForm({
    resolver: zodResolver(
      activeTab === AUTH_TABS.LOGIN ? loginSchema : registerSchema
    ),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    getUserDetails("90aa770c-45e1-4800-83a9-489207a8dbcc").then((response) => {
      setUser(response);
      console.log(response);
    });
  }, []);

  async function loginUser(values: LoginFormValues) {
    login(values).then((response) => {
      setUser(response);
      setOpenLoginModal(false);
    });
  }

  async function registerUser(values: RegisterFormValues) {
    register(values).then((response) => {
      setUser(response);
      setOpenLoginModal(false);
    });
  }

  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-2xl font-bold flex items-center">
        <Wallet />
        &nbsp;<span className="text-[#4CAF50]">ex</span>FLOW
      </h1>
      <div>
        {user ? (
          <UserAvatar />
        ) : (
          <Dialog open={openLoginModal} onOpenChange={setOpenLoginModal}>
            <DialogTrigger asChild>
              <Button variant="outline" className="data-[state=active]:block">
                LOGIN
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Welcome</DialogTitle>
                <DialogDescription>
                  Sign in to your account or create a new one
                </DialogDescription>
              </DialogHeader>
              <Tabs
                className="mt-4"
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">LOGIN</TabsTrigger>
                  <TabsTrigger value="register">REGISTER</TabsTrigger>
                </TabsList>
                <TabsContent value={AUTH_TABS.LOGIN}>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(loginUser)}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your email"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Enter your password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={form.formState.isSubmitting}
                      >
                        {form.formState.isSubmitting
                          ? "Logging in..."
                          : "Login"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                <TabsContent value={AUTH_TABS.REGISTER} className="space-y-4">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(registerUser)}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your email"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Enter your password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={form.formState.isSubmitting}
                      >
                        {form.formState.isSubmitting
                          ? "Creating account..."
                          : "Create my account"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
