import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, amount, source, date, description } = body;

    const stmt = db.prepare(
      'INSERT INTO income (title, amount, source, date, description) VALUES (?, ?, ?, ?, ?)'
    );
    
    const result = stmt.run(title, amount, source, date, description);

    return NextResponse.json({ 
      message: 'Income created successfully',
      id: result.lastInsertRowid 
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating income:', error);
    return NextResponse.json(
      { error: 'Failed to create income' },
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
      SELECT i.*, c.color as sourceColor 
      FROM income i
      LEFT JOIN categories c ON i.source = c.name AND c.type = 'income'
    `;
    const params: string[] = [];

    if (startDate && endDate) {
      query += ' WHERE i.date BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    query += ' ORDER BY i.date DESC, i.created_at DESC';

    const stmt = db.prepare(query);
    const income = params.length > 0 ? stmt.all(...params) : stmt.all();
    
    console.log('Income with colors:', income); // Debug log

    return NextResponse.json(income);
  } catch (error) {
    console.error('Error fetching income:', error);
    return NextResponse.json(
      { error: 'Failed to fetch income' },
      { status: 500 }
    );
  }
} 