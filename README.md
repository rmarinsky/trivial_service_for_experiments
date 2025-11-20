# Playwright Response Handling Test Application

This is a minimal Next.js application designed to test and verify Playwright's response handling capabilities, specifically comparing two approaches to capturing API responses:

1. **Sequential await** (click then wait): `await page.click(); await page.waitForResponse()`
2. **Promise-first** (classic approach): `const promise = page.waitForResponse(); await page.click(); await promise;`

## Purpose

This application helps answer the question: **Can Playwright reliably catch responses using sequential await calls, even if the response arrives very quickly (100-200ms)?**

## Features

### Frontend
- Simple form with username and email fields
- "Create User" button that triggers API call
- Response display area showing:
  - Success message with user data
  - Detailed timing information (button click, request sent, response received)
  - Client-side and server-side duration
  - Raw JSON response
- Console logging with ISO timestamps for debugging

### Backend API
- POST endpoint: `/api/users`
- In-memory user storage
- Returns user data with timestamps
- Custom `X-Request-ID` header for request tracking
- Optional GET endpoint to retrieve all users

### Playwright Tests
- 5 comprehensive test scenarios:
  1. Sequential await approach
  2. Promise-first approach
  3. Stress test with multiple rapid submissions
  4. Slow network edge case
  5. Response header verification
- Uses [@faker-js/faker](https://fakerjs.dev/) to generate random usernames and emails
- No hardcoded test data - each run uses unique values

## Setup

### Install Dependencies

```bash
npm install
```

This will install:
- Next.js 16 with React 19
- Playwright Test
- Faker.js (for random test data)
- TypeScript
- Tailwind CSS

### Install Playwright Browsers

```bash
npx playwright install
```

## Running the Application

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Manual Testing
1. Fill in the username and email fields
2. Click "Create User"
3. Watch the response display area populate with data
4. Open browser console to see detailed timing logs

Example console output:
```
[2025-11-20T14:30:45.123Z] CLIENT: Button clicked - Timestamp: 1700491845123
[2025-11-20T14:30:45.125Z] CLIENT: Request sent - Timestamp: 1700491845125
[2025-11-20T14:30:45.278Z] CLIENT: Response received - Timestamp: 1700491845278
[2025-11-20T14:30:45.279Z] CLIENT: Response parsed - Duration: 153ms
```

## Running Playwright Tests

### Run All Tests

```bash
npx playwright test
```

### Run Tests with UI

```bash
npx playwright test --ui
```

### Run Specific Test

```bash
npx playwright test -g "Sequential await"
```

### Run with Headed Browser

```bash
npx playwright test --headed
```

### View Test Report

```bash
npx playwright show-report
```

## Test Scenarios Explained

### Test 1: Sequential Await
```typescript
await page.getByText('Create User').click();
const response = await page.waitForResponse('**/api/users');
```
Tests if Playwright can catch the response even when `waitForResponse` is called **after** the click event.

### Test 2: Promise-First
```typescript
const responsePromise = page.waitForResponse('**/api/users');
await page.getByText('Create User').click();
const response = await responsePromise;
```
The classic "safe" approach that sets up the listener before triggering the action.

### Test 3: Stress Test
Performs 3 rapid consecutive submissions to verify no responses are lost.

### Test 4: Slow Network
Simulates network latency (300ms+ delay) to test edge cases with slower responses.

### Test 5: Header Verification
Verifies that custom response headers (X-Request-ID) are accessible.

## Expected Results

Both approaches (sequential await and promise-first) should work reliably because:

1. **Playwright's Network Interception**: Playwright intercepts network activity at the browser level before it reaches the page JavaScript
2. **Event Buffering**: Network events are buffered while waiting for the test to set up listeners
3. **Timing Window**: Even without artificial delay, Playwright has plenty of time to set up the listener

## Key Observations

### Console Timestamps
You'll see timing information from three perspectives:
- **Client**: Browser-side timing (button click → response received)
- **Server**: API processing time (includes artificial delay)
- **Test**: Playwright test timing (click → response capture)

### Timing Breakdown
```
Button Click:       T+0ms
Request Sent:       T+2ms
API Processing:     100-200ms (artificial delay)
Response Received:  T+150ms (example)
Total Duration:     ~150ms
```

## Project Structure

```
.
├── app/
│   ├── api/
│   │   └── users/
│   │       └── route.ts          # API endpoint with delay
│   ├── page.tsx                  # Form component with timing
│   └── globals.css
├── tests/
│   └── user-creation.spec.ts     # Playwright test suite
├── playwright.config.ts          # Playwright configuration
├── package.json
└── README.md
```

## Technical Details

- **Next.js**: 16.0.3 (App Router)
- **React**: 19.2.0
- **Playwright**: ^1.48.0
- **Faker.js**: ^9.2.0
- **TypeScript**: ^5
- **Styling**: Tailwind CSS 4

## API Endpoint Details

### POST /api/users

**Request:**
```json
{
  "username": "testuser",
  "email": "test@example.com"
}
```

**Response (201):**
```json
{
  "success": true,
  "user": {
    "id": "user-1234567890-abc123",
    "username": "testuser",
    "email": "test@example.com",
    "createdAt": 1700491845278
  },
  "timestamp": 1700491845278,
  "requestDuration": 153
}
```

**Headers:**
- `X-Request-ID`: Unique request identifier (e.g., `req-1234567890-xyz789`)

### GET /api/users

Returns all users stored in memory (resets on server restart).

## Debugging Tips

1. **Enable verbose Playwright logs:**
   ```bash
   DEBUG=pw:api npx playwright test
   ```

2. **View network activity:**
   ```bash
   npx playwright test --headed --debug
   ```

3. **Check server logs:**
   The dev server console shows detailed API timing logs

4. **Use trace viewer:**
   ```bash
   npx playwright test --trace on
   npx playwright show-trace trace.zip
   ```

## Conclusion

This application demonstrates that **both approaches work reliably** with Playwright. The sequential await approach is simpler and more intuitive, while the promise-first approach is a defensive programming pattern that was historically necessary in some testing frameworks but is not strictly required for Playwright.
