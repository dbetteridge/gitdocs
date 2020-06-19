import React, { useState, useContext } from "react";
import { Box, Flex } from "rebass";
import { Button } from "antd";
import Input from "antd/lib/input/Input";
import { handleChange } from "@utils/front-helpers";
import { store } from "@contexts/store";
import { useRouter } from "next/router";
import Text from "antd/lib/typography/Text";

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

const bannedNames = [
  RegExp("^(app|createspace|index|login)$"),
  RegExp(/\[.+\]/),
];

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
          <Flex my={2} width={1} flexDirection={"column"}>
            <Text>Invalid names include</Text>
            <Text>app, createspace, login, index, [strings]</Text>
          </Flex>
          <Box my={2} width={1}>
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
          <Box my={2} width={1}>
            <Button
              name="createSpace"
              type="primary"
              style={{ marginRight: "2rem" }}
              onClick={() => {
                if (bannedNames.some((reg) => reg.test(space.space))) {
                  setError({
                    hasError: true,
                    error: `${space.space} is not a valid name`,
                  });
                } else {
                  createSpace(space, router, {
                    setState,
                    setSpace,
                    setError,
                  });
                }
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
