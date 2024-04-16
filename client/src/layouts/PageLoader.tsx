import { Flex, Spinner } from "@chakra-ui/react";

export const PageLoader = () => (
  <Flex
    width={"100vw"}
    height={"100vh"}
    justifyContent={"center"}
    alignItems={"center"}
  >
    <Spinner
      size="xl"
      thickness="4px"
      speed="0.45s"
      emptyColor="gray.200"
      color="green.400"
    />
  </Flex>
);
