import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginUser, loginWithGoogle, registerUser } from "@/lib/authHandlers";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { RotateCw } from "lucide-react";

interface LocationState {
  from: string;
}

export const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [registered, setRegistered] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as LocationState)?.from || "/";
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      if (registered) {
        loginUser(email, password, dispatch, navigate, from);
      } else {
        registerUser(email, password, username, dispatch, navigate, from);
      }
    } catch (error) {
      handleLoginError(error, toast);
    }
    setIsSubmitting(false);
  };

  const handleGoogleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      loginWithGoogle(dispatch, navigate, from);
    } catch (error) {
      handleLoginError(error, toast);
    }
  };

  return (
      <Card className="p-5 glass m-auto w-60">
        <form
          onSubmit={(e) => void handleSubmit(e)}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            padding: "8px 0",
          }}
        >
          {registered ? null : (
            <Input
              name="username"
              autoComplete="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="glass-fg"
            />
          )}
          {renderEmailInput(email, setEmail)}
          {renderPasswordInput(password, setPassword)}
          {renderSubmitButton(registered, isSubmitting)}
          {renderGoogleLoginButton(handleGoogleLogin)}
        </form>
        {renderToggleRegisterLogin(registered, setRegistered)}
      </Card>
  );
};

function renderEmailInput(
  email: string,
  setEmail: {
    (value: React.SetStateAction<string>): void;
    (arg0: string): void;
  }
) {
  return (
    <Input
      name="email"
      autoComplete="email"
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="glass-fg"
    />
  );
}

function renderPasswordInput(
  password: string,
  setPassword: {
    (value: React.SetStateAction<string>): void;
    (arg0: string): void;
  }
) {
  return (
    <Input
      name="password"
      autoComplete="current-password"
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="glass-fg"
    />
  );
}

function renderSubmitButton(registered: boolean, loggingIn: boolean) {
  return (
    <Button type="submit" className="shadow-md">
      {loggingIn ? (
        <RotateCw className="animate-spin" />
      ) : registered ? (
        "Sign in"
      ) : (
        "Sign up"
      )}
    </Button>
  );
}

function renderGoogleLoginButton(handleGoogleLogin: {
  (e: React.FormEvent): void;
}) {
  return (
    <Button
      onClick={(e) => void handleGoogleLogin(e)}
      variant="outline"
      className="glass-fg"
    >
      Sign in with Google
    </Button>
  );
}

function renderToggleRegisterLogin(
  registered: boolean,
  setRegistered: {
    (value: React.SetStateAction<boolean>): void;
    (arg0: boolean): void;
  }
) {
  return (
    <small className="text-center -mb-1">
      {registered ? "Don't have an account? " : "Already have an account? "}
      <a
        onClick={() => setRegistered(!registered)}
        className="text-violet-500 cursor-pointer"
      >
        {registered ? "Sign up" : "Sign in"}
      </a>
    </small>
  );
}

function handleLoginError(
  error: unknown,
  toast: ReturnType<typeof useToast>["toast"]
) {
  console.error("Login Error: ", error);
  if (error !== null && error instanceof Error) {
    console.error(error.message);
  }
  // TODO: Handle error messages
  toast({
    variant: "destructive",
    description: "An error occurred while logging in. Please try again.",
  });
}

export default SignInForm;
