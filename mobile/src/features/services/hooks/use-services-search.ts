import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { type SearchTaskersInput, searchTaskers } from '@/features/services/api/search-taskers';

export function useServicesSearch(input: SearchTaskersInput) {
  const [debouncedQuery, setDebouncedQuery] = React.useState(input.query);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(input.query), 400);

    return () => clearTimeout(timer);
  }, [input.query]);

  return useQuery({
    placeholderData: (previousData) => previousData,
    queryFn: () =>
      searchTaskers({
        ...input,
        query: debouncedQuery,
      }),
    queryKey: [
      'tasker-search',
      debouncedQuery,
      input.availability,
      input.categoryId,
      input.maxPrice,
      input.minRating,
      input.sortBy,
    ],
  });
}
