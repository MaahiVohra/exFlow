import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, amount, category, date, description } = body;

    const stmt = db.prepare(
      'INSERT INTO expenses (title, amount, category, date, description) VALUES (?, ?, ?, ?, ?)'
    );
    
    const result = stmt.run(title, amount, category, date, description);

    return NextResponse.json({ 
      message: 'Expense created successfully',
      id: result.lastInsertRowid 
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json(
      { error: 'Failed to create expense' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let query = `
      SELECT e.*, c.color as categoryColor 
      FROM expenses e
      LEFT JOIN categories c ON e.category = c.name AND c.type = 'expense'
    `;
    const params: string[] = [];

    if (startDate && endDate) {
      query += ' WHERE e.date BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    query += ' ORDER BY e.date DESC, e.created_at DESC';

    const stmt = db.prepare(query);
    const expenses = params.length > 0 ? stmt.all(...params) : stmt.all();
    
    console.log('Expenses with colors:', expenses); // Debug log

    return NextResponse.json(expenses, { status: 200 });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch expenses' },
      { status: 500 }
    );
  }
} 