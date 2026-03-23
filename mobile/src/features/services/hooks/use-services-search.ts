import { useQuery } from "@tanstack/react-query";
import React from "react";

import {
  searchServices,
  type SearchServicesInput
} from "@/features/services/api/search-services";

export function useServicesSearch(input: SearchServicesInput) {
  const [debouncedQuery, setDebouncedQuery] = React.useState(input.query);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(input.query), 400);

    return () => clearTimeout(timer);
  }, [input.query]);

  return useQuery({
    placeholderData: (previousData) => previousData,
    queryFn: () =>
      searchServices({
        ...input,
        query: debouncedQuery
      }),
    queryKey: [
      "services-search",
      debouncedQuery,
      input.categoryId,
      input.minPrice,
      input.maxPrice,
      input.minRating
    ]
  });
}
