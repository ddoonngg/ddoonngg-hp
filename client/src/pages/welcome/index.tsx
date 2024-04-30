import { useEffect, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import axios from "axios";

import { PageLoader } from "../../layouts/PageLoader";
import ChatWindow from "../ChatWindow/ChatWindow";

export function Welcome() {
  const [visitorsCount, setVisitorsCount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading || visitorsCount === null) {
    return <PageLoader />;
  }

  return <ChatWindow />;
}
