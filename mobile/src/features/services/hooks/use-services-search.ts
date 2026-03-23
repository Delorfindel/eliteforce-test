import { useQuery } from "@tanstack/react-query";
import React from "react";

import {
  searchProviderServices,
  type SearchProviderServicesInput
} from "@/features/services/api/search-provider-services";

export function useServicesSearch(input: SearchProviderServicesInput) {
  const [debouncedQuery, setDebouncedQuery] = React.useState(input.query);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(input.query), 400);

    return () => clearTimeout(timer);
  }, [input.query]);

  return useQuery({
    placeholderData: (previousData) => previousData,
    queryFn: () =>
      searchProviderServices({
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
