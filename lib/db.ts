import Database from 'better-sqlite3';
import { join } from 'path';

const db = new Database(join(process.cwd(), 'expenses.db'));

// Create expenses table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    category TEXT NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Add income table
db.exec(`
  CREATE TABLE IF NOT EXISTS income (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    source TEXT NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create categories table
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL CHECK(type IN ('expense', 'income')),
    color TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Function to generate a random color
function getRandomColor() {
  const colors = [
    'rose', 'pink', 'fuchsia', 'purple', 'violet', 'indigo', 'blue', 
    'cyan', 'teal', 'emerald', 'green', 'lime', 'yellow', 'amber', 
    'orange', 'red'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Insert default categories if none exist
const defaultCategories = [
  { name: 'Food', type: 'expense', color: getRandomColor() },
  { name: 'Transportation', type: 'expense', color: getRandomColor() },
  { name: 'Utilities', type: 'expense', color: getRandomColor() },
  { name: 'Entertainment', type: 'expense', color: getRandomColor() },
  { name: 'Other', type: 'expense', color: getRandomColor() },
  { name: 'Salary', type: 'income', color: getRandomColor() },
  { name: 'Freelance', type: 'income', color: getRandomColor() },
  { name: 'Investments', type: 'income', color: getRandomColor() },
  { name: 'Gifts', type: 'income', color: getRandomColor() },
  { name: 'Other', type: 'income', color: getRandomColor() },
];

for (const category of defaultCategories) {
  db.prepare(`
    INSERT OR IGNORE INTO categories (name, type, color)
    VALUES (?, ?, ?)
  `).run(category.name, category.type, category.color);
}

export default db; 