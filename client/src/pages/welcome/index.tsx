import { useEffect, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import axios from "axios";

import { PageLoader } from "../../layouts/PageLoader";
import ChatWindow from "../ChatWindow/ChatWindow";

export function Welcome() {
  const [visitorsCount, setVisitorsCount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (showWelcome) {
        setShowWelcome(false);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [showWelcome]);

  useEffect(() => {
    const lastVisitTime = localStorage.getItem("lastVisitTime");
    // if last visit time is not set or last visit time is more than 24 hours ago
    if (
      !lastVisitTime ||
      Date.now() - parseInt(lastVisitTime) > 1000 * 60 * 60 * 24
    ) {
      // increment visitors count
      axios
        .post("/api/visitors/count")
        .then((response) => {
          setVisitorsCount(response.data.count);
        })
        .finally(() => {
          localStorage.setItem("lastVisitTime", Date.now().toString());
          setIsLoading(false);
        });
    } else {
      axios
        .get("/api/visitors/count")
        .then((response) => {
          setVisitorsCount(response.data.count);
        })
        .finally(() => {
          localStorage.setItem("lastVisitTime", Date.now().toString());
          setIsLoading(false);
        });
    }
  }, []);

  const gradientBackground =
    "linear-gradient(135deg, #78ffd6 0%, #a8ff78 100%)";

  if (isLoading || visitorsCount === null) {
    return <PageLoader />;
  }

  return showWelcome ? (
    <Flex
      width={"100vw"}
      height={"100vh"}
      justifyContent={"center"}
      alignItems={"center"}
      css={{ background: gradientBackground }}
    >
      <Box fontSize={["2xl", "3xl", "4xl"]} className="gluten-title" p={[4, 8]}>
        Greetings! You are our {visitorsCount} visitor.
      </Box>
    </Flex>
  ) : (
    <ChatWindow />
  );
}
