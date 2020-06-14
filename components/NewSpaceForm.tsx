import React, { useState, useContext } from "react";
import { Box, Flex, Button } from "rebass";
import Input from "antd/lib/input/Input";
import { handleChange } from "@utils/front-helpers";
import { store } from "@contexts/store";
import { useRouter } from "next/router";

const createSpace = async (
  details,
  router,
  { setState, setSpace, setError }
) => {
  const token = window.localStorage.getItem("token");
  const space = await fetch("/api/spaces", {
    method: "POST",
    body: JSON.stringify(details),
    headers: { Authorization: token },
  })
    .then((d) => {
      if (!d.ok) {
        window.location.replace("/login");
      }
      return d;
    })
    .then((response: Response) => response.json());

  if (!space.error) {
    setState({ id: details.space, active: true });
    setSpace({ space: "" });
    router.push("/[space]", `/${details.space}`);
  } else {
    setError({ hasError: true, error: space.error });
    setTimeout(() => {
      setError({ hasError: false, error: "" });
      setSpace({ space: "" });
    }, 1000);
  }
};

const NewSpaceForm = () => {
  const router = useRouter();
  const [space, setSpace] = useState({ space: "" });
  const globalState: any = useContext(store);
  const { dispatch } = globalState;
  const setState = (value) => {
    dispatch({ type: "ADDSPACE", space: value });
  };

  const toggleForm = () => {
    dispatch({ type: "TOGGLE_NEW_SPACE_FORM" });
  };
  const [error, setError] = useState({ hasError: false, error: "" });

  return (
    <Flex
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
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
            <Input
              id="space"
              autoComplete="space"
              name="space"
              addonBefore={"gitdocs.page/"}
              onChange={handleChange("space", space, setSpace)}
              onSelect={handleChange("space", space, setState)}
              onFocus={handleChange("space", space, setState)}
              onMouseOver={handleChange("space", space, setState)}
            ></Input>
          </Box>
          {error.hasError && <Box>{error.error}</Box>}
          <Box px={2} my={2} width={1}>
            <Button
              name="createSpace"
              variant="primary"
              mr={2}
              onClick={() => {
                createSpace(space, router, {
                  setState,
                  setSpace,
                  setError,
                });
              }}
            >
              Create
            </Button>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
};

export default NewSpaceForm;
