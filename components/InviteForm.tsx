import React, { useState, useEffect } from "react";
import { Box, Flex, Heading } from "rebass";
import { useRouter, NextRouter } from "next/router";
import { debounce } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Button, Input } from "antd";

const inviteUser = async (
  details: { emails?: string[]; space?: string | string[] },
  router: NextRouter,
  { setState, setSuccess, setError }
) => {
  const result = await fetch(`/api/spaces/${details.space}`, {
    method: "POST",
    body: JSON.stringify({ emails: details.emails }),
    headers: { Authorization: localStorage.getItem("token") },
  }).then((response: Response) => response.json());

  if (result) {
    setSuccess(true);
    setState({ emails: [], space: "" });
  } else {
    setError({
      hasError: true,
      error: `Invite to ${details.emails} for ${details.space} failed`,
    });
    setTimeout(() => {
      setError({ hasError: false, error: "" });
      setState({ emails: [], space: "" });
    }, 1000);
  }
};

const InviteForm = () => {
  const router = useRouter();
  const [state, setState] = useState<{
    emailInput: string;
    emails: string[];
    space?: string | string[];
    timer?: any;
  }>({
    emailInput: "",
    emails: [],
    space: router.query && router.query.space,
    timer: null,
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState({ hasError: false, error: "" });

  const addEmail = (email) => {
    if (email.length) {
      if (state.timer) {
        clearTimeout(state.timer);
      }
      const timer = setTimeout(() => {
        setState({
          ...state,
          emails: state.emails.concat([email]),
          emailInput: "",
        });
      }, 1000);
      setState({ ...state, timer, emailInput: email });
    }
  };

  useEffect(() => {
    if (router.query && router.query.space) {
      setState({ ...state, space: router.query.space });
    }
  }, [router.query]);
  if (success) {
    return <h3>Invited successfully</h3>;
  }
  return (
    <Box
      as="form"
      onSubmit={(e) => e.preventDefault()}
      mt={4}
      width={[3 / 4, 1 / 2]}
    >
      <Flex width={1} flexDirection={"column"}>
        <Heading>Add People to this space</Heading>
        <Box my={2} width={1}>
          <Input
            id="emails"
            autoComplete="emails"
            name="emails"
            placeholder={"test@test.com"}
            value={state.emailInput}
            onChange={(event) => {
              if (event.target.value) {
                addEmail(event.target.value.trim());
              }
            }}
            onBlur={() => {
              if (
                state.emailInput.length &&
                state.emailInput.replace(/ /g, "") !== ""
              ) {
                setState({
                  ...state,
                  emails: state.emails.concat([state.emailInput]),
                  emailInput: "",
                });
              }
            }}
          ></Input>
          <Box>
            {state.emails.map((email) => (
              <Flex
                flexDirection={"row"}
                justifyContent={"center"}
                px={1}
                py={1}
                my={1}
                sx={{
                  border: "1px solid grey",
                  borderRadius: "5px",
                }}
                key={email}
              >
                <Box width={0.9} sx={{ fontSize: "12px" }}>
                  {email}
                </Box>
                <FontAwesomeIcon
                  width={0.1}
                  icon={faTimes}
                  onClick={() => {
                    setState({
                      ...state,
                      emails: state.emails.filter((item) => item !== email),
                    });
                  }}
                />
              </Flex>
            ))}
          </Box>
        </Box>

        {error.hasError && <Box>{error.error}</Box>}
        <Box my={2} width={1}>
          <Button
            name="invite"
            type="primary"
            onClick={() => {
              inviteUser(state, router, { setState, setSuccess, setError });
            }}
          >
            Invite
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};

export default InviteForm;
