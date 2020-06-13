import React from "react";
import { Box, Flex } from "rebass";
import { Input } from "@rebass/forms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
const Search = () => {
  return (
    <Flex>
      <Flex px={3} flexDirection={"column"} justifyContent={"center"}>
        <FontAwesomeIcon icon={faSearch} />
      </Flex>
      {false && <Input />}
    </Flex>
  );
};

export default Search;
