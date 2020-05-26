import React, { useEffect, useState, useContext } from "react";
import { Card, Heading, Button, Flex } from "rebass";
import { store } from "../contexts/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import NewSpaceForm from "./NewSpaceForm";
import { useRouter } from "next/router";

const fetchSpaces = async (setter) => {
  const spaces = await fetch("/api/spaces", {
    method: "GET",
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  }).then((d) => d.json());
  setter(spaces);
};

const Name = (props) => (
  <Button
    {...props}
    px={3}
    py={3}
    my={3}
    variant={props.selected ? "primary" : "secondary"}
  />
);

const Spaces = () => {
  const router = useRouter();
  const globalState: any = useContext(store);
  const { dispatch, state } = globalState;
  const { spaces, selectedSpace } = state;
  const setUserSpaces = (value) => {
    dispatch({ type: "SETSPACES", spaces: value });
  };

  const setSelected = (value) => {
    dispatch({ type: "SELECT_SPACE", space: value });
  };

  useEffect(() => {
    fetchSpaces(setUserSpaces);
  }, []);

  return (
    <Card
      width={[1, 3 / 4]}
      px={5}
      sx={(props) => ({ backgroundColor: props.colors.muted })}
    >
      <Heading>Spaces</Heading>
      <Flex
        my={2}
        flexDirection={"row"}
        justifyContent={"space-between"}
        flexWrap={"wrap"}
        alignItems={"center"}
      >
        {spaces.map(
          (space) =>
            space.active && (
              <Name
                key={space.id}
                selected={selectedSpace === space.id}
                onClick={() => {
                  setSelected(space.id);
                  router.push(`/${space.id}`);
                }}
              >
                {space.id}
              </Name>
            )
        )}
      </Flex>
      <Button
        onClick={() => {
          dispatch({ type: "TOGGLE_NEW_SPACE_FORM" });
        }}
      >
        <FontAwesomeIcon icon={faPlus} />
      </Button>
      {state.showNewSpaceForm && <NewSpaceForm />}
    </Card>
  );
};

export default Spaces;
