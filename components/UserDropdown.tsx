"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "@/components/UserAvatar";
import { useAuth } from "@/context/AuthContext";
import { LogOut } from "lucide-react";

export default function UserDropdown() {
  const auth = useAuth();

  if (!auth.user) return;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
          <UserAvatar />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-72">
        {/* User Details Section */}
        <div className="flex items-center gap-3 px-4 py-3">
          <UserAvatar />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground truncate">
              {auth.user.name}
            </p>
            <p className="text-sm text-muted-foreground truncate">
              {auth.user.email}
            </p>
          </div>
        </div>

        {/* Separator */}
        <DropdownMenuSeparator />

        {/* Action Items */}
        <button
          onClick={auth.logoutUser}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
