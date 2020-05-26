import React from "react";
import { Box, Flex } from "rebass";
import { Input } from "@rebass/forms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
const Search = () => {
  return (
    <Flex width={[1 / 2, 1 / 4]}>
      <Flex px={3} flexDirection={"column"} justifyContent={"center"}>
        <FontAwesomeIcon icon={faSearch} />
      </Flex>
      <Input />
    </Flex>
  );
};

export default Search;
