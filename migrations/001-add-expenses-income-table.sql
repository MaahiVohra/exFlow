CREATE TABLE
    IF NOT EXISTS expense (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        date DATE NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS income (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        amount REAL NOT NULL,
        source TEXT NOT NULL,
        date DATE NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
        color TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );