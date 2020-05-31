import React, { useState } from "react";
import { Box, Flex, Button } from "rebass";
import { Label, Input } from "@rebass/forms";
import { RegistrationDetails } from "../interfaces/Login";
import { handleChange } from "@utils/front-helpers";
import { useRouter, NextRouter } from "next/router";

const register = async (
  details: RegistrationDetails,
  router: NextRouter,
  { setState, setError, state }
) => {
  const token = await fetch("/api/users/register", {
    method: "POST",
    body: JSON.stringify(details),
  }).then((response: Response) => response.json());
  if (!token.error) {
    window.localStorage.setItem("token", token);
    router.push("/");
  } else {
    setError({ hasError: true, error: token.error });
    setTimeout(() => {
      setError({ hasError: false, error: "" });
      setState({ ...state, email: "" });
    }, 1500);
  }
};

const LoginForm = () => {
  const [state, setState] = useState<RegistrationDetails>({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState({ hasError: false, error: "" });
  const router = useRouter();
  return (
    <Flex
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      width={"100%"}
      height={"100%"}
    >
      <Box
        as="form"
        onSubmit={(e) => e.preventDefault()}
        py={3}
        width={[3 / 4, 1 / 4]}
        height={"50%"}
      >
        <Flex
          width={1}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Box px={2} my={2} width={1}>
            <Label htmlFor="name">Name</Label>
            <Input
              autoComplete="name"
              name="name"
              onChange={handleChange("name", state, setState)}
              onSelect={handleChange("name", state, setState)}
              onFocus={handleChange("name", state, setState)}
              onMouseOver={handleChange("name", state, setState)}
            ></Input>
          </Box>
          <Box px={2} my={2} width={1}>
            <Label htmlFor="email">Email</Label>
            <Input
              autoComplete="email"
              name="email"
              onChange={handleChange("email", state, setState)}
              onSelect={handleChange("email", state, setState)}
              onFocus={handleChange("email", state, setState)}
              onMouseOver={handleChange("email", state, setState)}
            ></Input>
          </Box>
          <Box px={2} my={2} width={1}>
            <Label htmlFor="Password">Password</Label>
            <Input
              type="password"
              autoComplete="password"
              name="password"
              onChange={handleChange("password", state, setState)}
              onSelect={handleChange("password", state, setState)}
              onFocus={handleChange("password", state, setState)}
              onMouseOver={handleChange("password", state, setState)}
            ></Input>
          </Box>
          {error.hasError && <Box>{error.error}</Box>}
          <Box px={2} my={2} width={1}>
            <Button
              name="register"
              variant="primary"
              mr={2}
              onClick={() => {
                register(state, router, { state, setState, setError });
              }}
            >
              Register
            </Button>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
};

export default LoginForm;
