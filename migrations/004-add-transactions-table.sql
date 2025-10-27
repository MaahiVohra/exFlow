CREATE TABLE
    IF NOT EXISTS type_groups (
        id INTEGER PRIMARY KEY,
        name VARCHAR(255) NOT NULL,

        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP DEFAULT NULL
    );


INSERT INTO type_groups (id, name)
VALUES (1, 'Transaction Types');

CREATE TABLE
    IF NOT EXISTS types (
        id INTEGER PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type_group_id INTEGER NOT NULL REFERENCES type_groups(id),

        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP DEFAULT NULL
    );

INSERT INTO types (id, name, type_group_id)
VALUES (1, 'Income', 1), (2, 'Expense', 1);

CREATE TABLE
    IF NOT EXISTS transactions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        transaction_date DATE NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        recurring BOOLEAN NOT NULL DEFAULT FALSE,

        user_id UUID NOT NULL REFERENCES users(id),
        type_id INTEGER NOT NULL REFERENCES types(id),

        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP DEFAULT NULL
    );
