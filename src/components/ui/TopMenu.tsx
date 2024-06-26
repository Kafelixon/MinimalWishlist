import { Button } from "@/components/ui/button";
import { logout } from "@/redux/slices/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { LogOut, Settings } from "lucide-react";
import { useUser } from "@/lib/common";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

export function TopMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useUser();
  const userAvatar = user?.photoURL as string;

  const getUserInitials = () => {
    if (!user || !user.displayName) return "?";
    return user.displayName.split(" ").map((n) => n[0]);
  };

  const navigateToLogin = () => {
    navigate("/login");
  };

  const navigateToHome = () => {
    navigate("/");
  };

  const navigateToWishlist = () => {
    navigate("/wishlists");
  };

  const navigateToSettingsPage = () => {
    navigate("/settings");
  };

  const NavButtons = () => {
    if (location.pathname === "/login") return;
    if (!user) return <Button onClick={navigateToLogin}>Sign up</Button>;
    return (
      <>
        <Button
          variant="ghost"
          className="text-stone-600 px-2 md:px-3 lg:px-4"
          onClick={navigateToWishlist}
        >
          Wishlists
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src={userAvatar} />
              <AvatarFallback>{getUserInitials()}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={navigateToSettingsPage}
              className="gap-1"
            >
              <Settings /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => dispatch(logout())}
              className="gap-1"
            >
              <LogOut /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    );
  };

  return (
    <div className="top-0 left-0 w-full flex items-center justify-between z-10">
      <div>
        <h1
          className="text-3xl font-extrabold tracking-tight lg:text-4xl"
          onClick={navigateToHome}
        >
          WishBoard
        </h1>
      </div>
      <div className="flex items-end justify-between gap-1 lg:gap-2">
        <NavButtons />
      </div>
    </div>
  );
}
