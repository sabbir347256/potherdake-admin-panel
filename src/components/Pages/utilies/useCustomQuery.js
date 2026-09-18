import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useCustomQuery = ({ url, headers, queryKey }) => {
  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const config = headers ? { headers } : {};
      const response = await axios.get(url, config);
      return response.data;
    },
    placeholderData: (previousData) => previousData,
  });
};