import React, { useState } from "react";
import { Box, Flex, Button } from "rebass";
import { Label, Input } from "@rebass/forms";
import { useRouter, NextRouter } from "next/router";
import { handleChange } from "@utils/front-helpers";

const inviteUser = async (
  details: { email?: string; space?: string },
  router: NextRouter,
  { setState, setSuccess, setError }
) => {
  const result = await fetch(`/api/spaces/${details.space}`, {
    method: "POST",
    body: JSON.stringify({ email: details.email }),
  }).then((response: Response) => response.json());

  if (result) {
    setSuccess(true);
    setState({ email: "", space: "" });
  } else {
    setError({ hasError: true, error: "Username or Password is incorrect" });
    setTimeout(() => {
      setError({ hasError: false, error: "" });
      setState({ email: "", space: "" });
    }, 1000);
  }
};

const InviteForm = () => {
  const router = useRouter();
  const [state, setState] = useState<{ email: string; space?: string }>({
    email: "",
    space: router.query.space,
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState({ hasError: false, error: "" });
  if (success) {
    return <h3>Invited successfully</h3>;
  }
  return (
    <Flex
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      width={"100%"}
    >
      <Box
        as="form"
        onSubmit={(e) => e.preventDefault()}
        py={3}
        width={[3 / 4, 3 / 4]}
      >
        <Flex width={1} flexDirection={"column"}>
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

          {error.hasError && <Box>{error.error}</Box>}
          <Box px={2} my={2} width={1}>
            <Button
              name="invite"
              variant="primary"
              mr={2}
              onClick={() => {
                inviteUser(state, router, { setState, setSuccess, setError });
              }}
            >
              Invite
            </Button>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
};

export default InviteForm;
