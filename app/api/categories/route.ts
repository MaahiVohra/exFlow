import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    let query = 'SELECT * FROM categories';
    const params: string[] = [];

    if (type) {
      query += ' WHERE type = ?';
      params.push(type);
    }

    query += ' ORDER BY name ASC';

    const stmt = db.prepare(query);
    const categories = params.length > 0 ? stmt.all(...params) : stmt.all();
    
    console.log('Categories:', categories); // Debug log

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, type, color } = await request.json();

    if (!name || !type) {
      return NextResponse.json(
        { error: 'Name and type are required' },
        { status: 400 }
      );
    }

    const randomColor = [
      'rose', 'pink', 'fuchsia', 'purple', 'violet', 'indigo', 'blue', 
      'cyan', 'teal', 'emerald', 'green', 'lime', 'yellow', 'amber', 
      'orange', 'red'
    ][Math.floor(Math.random() * 16)];

    const stmt = db.prepare(
      'INSERT INTO categories (name, type, color) VALUES (?, ?, ?)'
    );
    
    const result = stmt.run(name, type, color || randomColor);

    return NextResponse.json({ 
      message: 'Category created successfully',
      id: result.lastInsertRowid 
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
} 