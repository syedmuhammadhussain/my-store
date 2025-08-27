import { useMedia } from "react-use";
import { BadgeCheck, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UserProfileDropDown({
  userImage,
  username,
  email,
  signOut,
}: {
  userImage?: string | null;
  username: string;
  email: string;
  signOut: ({
    callbackUrl,
    redirect,
  }: {
    callbackUrl: string;
    redirect: boolean;
  }) => void;
}) {
  const isDesktop = useMedia("(min-width: 1024px)", false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 text-left text-sm">
          <Button
            variant="outline"
            size="icon"
            className={cn("bg-transparent", { "border-0": isDesktop })}
          >
            <Avatar className="size-5 rounded-lg">
              <AvatarImage
                src={userImage ?? "/user-icon.svg"}
                alt={username}
                width={20}
                height={20}
              />
              <AvatarFallback className="rounded-lg">{username}</AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="size-8 rounded-lg">
              <AvatarImage
                src={userImage ?? "/user-icon.svg"}
                alt={username}
                width={20}
                height={20}
                sizes=""
              />
              <AvatarFallback className="rounded-lg">{username}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{username}</span>
              <span className="text-muted-foreground truncate text-xs">
                {email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => console.log("Account")}>
          <BadgeCheck className="w-3 h-3 text-black" />
          Account
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: "/", redirect: false })}
          className={cn("text-red-600 focus:text-red-600")}
        >
          <LogOut className="w-3 h-3 text-red-600" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
