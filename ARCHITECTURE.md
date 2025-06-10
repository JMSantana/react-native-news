# Architecture and Implementation Details

## Key Technical Decisions

### 1. API and Data Management

- Using the ScoreBat Video API (v3) for news content
- Note: Currently using a deprecated endpoint as the new one requires authentication
- Implemented client-side pagination (20 items per page) since the API doesn't support it
- Using React Query with:
  - 10-minute stale time (news doesn't change frequently)
  - 3 retry attempts with exponential backoff
  - Proper error handling for API failures

### 2. State Management

- **Remote State**: React Query for news data

  - Single query for all news to avoid multiple API calls
  - Client-side pagination using array slicing
  - Proper loading and error states

- **Local State**: Context + AsyncStorage for favorites
  - Using Context to avoid unnecessary AsyncStorage calls
  - Real-time updates across components
  - Using article titles as unique identifiers (API limitation)
  - Proper error handling for storage operations

### 3. Navigation and Routing

- Using Expo Router for file-based routing
- Implemented deep linking for article details
- Passing article data through route params (JSON stringified)
- Back navigation with proper state preservation

### 4. Performance Optimizations

- Memoized callbacks with useCallback
- Efficient list rendering with FlatList
- Proper loading states for initial load and pagination
- Toast notifications for user feedback (2s visibility)

### 5. Testing Strategy

- Unit tests for:
  - useNews hook (API integration)
  - useFavorites hook (storage operations)
- Integration tests for:
  - NewsList component (loading, error, empty states)
  - NewsDetail component (navigation, rendering)
- Proper mocking of:
  - AsyncStorage
  - Expo Router
  - API responses

### 6. Error Handling

- Comprehensive error states in UI
- Retry functionality for failed API calls
- Error logging for storage operations
- User-friendly error messages
- Empty state handling

## Known Limitations and Trade-offs

1. Using deprecated API endpoint (new one requires authentication)
2. Client-side pagination instead of server-side
3. Using article titles as unique identifiers
4. No offline support
5. No image caching strategy

## Future Improvements

1. Migrate to new API endpoint with proper authentication
2. Implement proper server-side pagination
3. Add unique IDs to articles
4. Add offline support with proper caching
5. Implement image caching
6. Add analytics for user behavior
7. Add proper error tracking
8. Consider adding internationalization
9. Add theme support for dark/light mode

## Development Notes

- The project follows a feature-based folder structure
- Each feature has its own tests and mocks
- Using TypeScript for type safety
- Following React Native best practices for performance
- Proper error boundaries and loading states
- Accessibility labels for screen readers
