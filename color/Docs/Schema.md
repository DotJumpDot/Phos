# color Database Schema

## Table of Contents

- [color Database Schema](#color-database-schema)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Core Entities](#core-entities)
    - [Entity Name](#entity-name)
  - [Entity Relationships](#entity-relationships)
  - [SQL Schema](#sql-schema)
    - [Create Tables](#create-tables)
  - [Sample Data](#sample-data)
  - [Data Types Notes](#data-types-notes)
  - [Migration Notes](#migration-notes)

---

## Overview

This document describes the complete database schema for color, including all entities, relationships, and sample data.

---

## Core Entities

### Entity Name

| Column      | Type     | Nullable | Description                        |
| ----------- | -------- | -------- | ---------------------------------- |
| id          | int      | No       | Primary key, auto-incremented ID   |
| uuid        | string   | No       | Unique identifier                  |
| column_name | str      | Yes/No   | Description of column              |
| created_at  | datetime | No       | Record creation timestamp (UTC)    |
| updated_at  | datetime | Yes      | Record last update timestamp (UTC) |

---

## Entity Relationships

```
table1 (1) ──── (many) table2
table3 (many) ──── (1) table4
```

---

## SQL Schema

### Create Tables

For PostgreSQL deployment, use the following schema:

```sql
-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS child_table;
DROP TABLE IF EXISTS parent_table;

-- Parent table
CREATE TABLE parent_table (
    id SERIAL PRIMARY KEY,
    uuid TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- Child table
CREATE TABLE child_table (
    id TEXT PRIMARY KEY,
    parent_id TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES parent_table(uuid)
);

-- Add foreign key constraints if needed
ALTER TABLE child_table ADD CONSTRAINT fk_child_parent FOREIGN KEY (parent_id) REFERENCES parent_table(uuid);

-- Performance indexes
CREATE INDEX idx_parent_table_uuid ON parent_table(uuid);
CREATE INDEX idx_child_table_parent_id ON child_table(parent_id);
CREATE INDEX idx_child_table_created_at ON child_table(created_at);
```

---

## Sample Data

```sql
-- Insert sample data for parent table
INSERT INTO parent_table (uuid, name, description, created_at)
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'Sample Name', 'Sample description', CURRENT_TIMESTAMP);

-- Insert sample data for child table
INSERT INTO child_table (id, parent_id, content, created_at, updated_at)
VALUES ('6ba7b810-9dad-11d1-80b4-00c04fd430c8', '550e8400-e29b-41d4-a716-446655440000', 'Sample content', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
```

---

## Data Types Notes

- **UUID**: Stored as TEXT for simplicity
- **Arrays**: Stored as native PostgreSQL arrays (e.g., text[])
- **JSON**: Stored as JSONB for PostgreSQL (or TEXT for SQLite)
- **Boolean**: Stored as BOOLEAN for PostgreSQL (or INTEGER 0/1 for SQLite)
- **Decimal**: Stored as DECIMAL for precision calculations
- **Datetime**: Stored as TIMESTAMP with CURRENT_TIMESTAMP defaults

---

## Migration Notes

When deploying to production:

1. Consider using PostgreSQL for better JSON support and performance
2. Add proper UUID generation in application code
3. Implement database migrations for schema changes
4. Add database constraints and triggers as needed
5. Run `ALTER TABLE` statements for schema additions
6. Test migrations on staging environment before production
