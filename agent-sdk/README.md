# Claude Agent SDK Project

This is a separate Claude Agent SDK project for building SQL queries with database schema definition.

## Project Structure

- `sdk.ts` - Claude Agent SDK entry point
- `schema.ts` - Database schema definitions
- `queries/` - Query modules for different domains:
  - `analytics_queries.ts`
  - `customer_queries.ts`
  - `inventory_queries.ts`
  - `order_queries.ts`
  - `product_queries.ts`
  - `promotion_queries.ts`
  - `review_queries.ts`
  - `shipping_queries.ts`

## Setup

This project requires additional dependencies not included in the main UIGen project:
- `sqlite`
- `sqlite3`
- `@anthropic-ai/claude-agent-sdk`

To set up this project independently, create a separate `package.json` in this directory with those dependencies.

## Integration with UIGen

The UIGen React component generator project is the primary application in this repository. This agent-sdk folder is a separate project that can be used independently or integrated as needed.
