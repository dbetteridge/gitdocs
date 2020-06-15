import React, { useState } from "react";
import { Box, Flex, Button } from "rebass";
import { Input } from "antd";
import { LoginCredentials } from "../interfaces/Login";
import { useRouter, NextRouter } from "next/router";
import { handleChange } from "@utils/front-helpers";

const login = async (
  details: LoginCredentials,
  router: NextRouter,
  { setState, setError }
) => {
  if (details.email.length === 0 || details.password.length === 0) {
    setError({
      hasError: true,
      error: "Email and Password cannot be empty",
    });
    setTimeout(() => {
      setError({ hasError: false, error: "" });
    }, 1000);
    return;
  }
  const token = await fetch("/api/users/login", {
    method: "POST",
    body: JSON.stringify(details),
  }).then((response: Response) => response.text());

  if (token.length) {
    window.localStorage.setItem("token", token);
    router.push("/app", "/app");
  } else {
    setError({ hasError: true, error: "Email or Password is incorrect" });
    setTimeout(() => {
      setError({ hasError: false, error: "" });
      setState({ email: "", password: "" });
    }, 1000);
  }
};

const LoginForm = () => {
  const [state, setState] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [error, setError] = useState({ hasError: false, error: "" });
  const [refs, setRefs] = useState({ email: null, password: null });
  const router = useRouter();
  return (
    <Flex
      flexDirection={"column"}
      alignItems={"center"}
      width={"100%"}
      height={"100%"}
    >
      <Box
        as="form"
        onSubmit={(e) => e.preventDefault()}
        py={3}
        height={"50%"}
        width={1}
      >
        <Flex
          width={1}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Box px={1} my={2} width={1}>
            <Input
              id="email"
              autoComplete="email"
              name="email"
              onChange={handleChange("email", state, setState)}
              onSelect={handleChange("email", state, setState)}
              onFocus={handleChange("email", state, setState)}
              onMouseOver={handleChange("email", state, setState)}
              ref={(input) => {
                if (!refs.email && input) {
                  setRefs({ ...refs, email: input });
                }
              }}
            ></Input>
          </Box>
          <Box px={1} my={2} width={1}>
            <Input
              id="password"
              autoComplete="password"
              name="password"
              type="password"
              onChange={handleChange("password", state, setState)}
              onSelect={handleChange("password", state, setState)}
              onFocus={handleChange("password", state, setState)}
              onMouseOver={handleChange("password", state, setState)}
              ref={(input) => {
                if (!refs.password && input) {
                  setRefs({ ...refs, password: input });
                }
              }}
            ></Input>
          </Box>
          {error.hasError && <Box>{error.error}</Box>}
          <Box px={1} my={2} width={1}>
            <Button
              name="login"
              variant="primary"
              mr={2}
              onClick={() => {
                refs.email.focus();
                refs.password.focus();
                login(state, router, { setState, setError });
              }}
            >
              Login
            </Button>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
};

export default LoginForm;
