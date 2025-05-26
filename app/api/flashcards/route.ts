import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'flashcards.json');

export async function GET() {
  try {
    const data = fs.readFileSync(filePath, 'utf8') || '[]';
    return NextResponse.json(JSON.parse(data));
  } catch (e) {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  const newCard = await request.json();
  const data = fs.existsSync(filePath)
    ? JSON.parse(fs.readFileSync(filePath, 'utf8') || '[]')
    : [];
  data.push(newCard);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  return NextResponse.json({ success: true });
}