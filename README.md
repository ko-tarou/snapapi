# SnapAPI

**Drop your JSON, get a REST API in 5 seconds.**

No signup. No credit card. Free forever.

[snapapi.akokoa1221.workers.dev](https://snapapi.akokoa1221.workers.dev)

## Features

- Instant REST API from JSON
- Full CRUD (GET, POST, PUT, DELETE)
- CORS enabled for all origins
- Auto-generate realistic mock data from schema
- Simulate response delays (0-5000ms)
- Random error injection for resilience testing
- Auto-generated API documentation
- 24-hour endpoint expiration
- Rate limiting for fair usage

## Quick Start

### 1. Web UI

Visit [snapapi.akokoa1221.workers.dev](https://snapapi.akokoa1221.workers.dev) and drop your JSON.

### 2. cURL

```bash
# Create a mock API
curl -X POST https://snapapi.akokoa1221.workers.dev/api/mock \
  -H "Content-Type: application/json" \
  -d '{"users":[{"id":1,"name":"Alice"},{"id":2,"name":"Bob"}]}'

# Response: {"id":"abc-123","endpoints":["users"],"url":"/api/mock/abc-123"}

# Use your API
curl https://snapapi.akokoa1221.workers.dev/api/mock/abc-123/users
```

### 3. Auto-Generate Data

```bash
curl -X POST https://snapapi.akokoa1221.workers.dev/api/mock \
  -H "Content-Type: application/json" \
  -d '{
    "_generate": {
      "users": {
        "count": 10,
        "schema": {
          "id": "autoincrement",
          "name": "name",
          "email": "email",
          "age": "number:18-65"
        }
      }
    }
  }'
```

Supported types: `autoincrement`, `name`, `email`, `number:min-max`, `boolean`, `text:sentence|paragraph|title|word`, `url`, `url:image`, `date:past|future`, `uuid`

## Simulation

Simulate delays and random errors for resilience testing:

```bash
curl -X POST https://snapapi.akokoa1221.workers.dev/api/mock \
  -H "Content-Type: application/json" \
  -d '{
    "_config": {"delay": 1000, "errorRate": 0.3, "errorStatus": 503},
    "items": [{"id": 1, "name": "Test"}]
  }'
```

## Tech Stack

- Next.js 16 (App Router)
- Cloudflare Pages + D1 (SQLite at edge)
- TypeScript + Tailwind CSS

## License

MIT

## Author

Built with [Claude Code](https://claude.ai/code)
