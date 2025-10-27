import { addTransaction, getTransactions } from "@/lib/data/transaction";
import { validateTransaction } from "@/lib/type-guards";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const transactionsList = await getTransactions();
    return NextResponse.json(transactionsList, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const transaction = await request.json();

  if (!validateTransaction(transaction)) {
    return NextResponse.json(
      { error: "Invalid transaction data" },
      { status: 400 },
    );
  }

  try {
    await addTransaction(transaction);
    return NextResponse.json(transaction, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 },
    );
  }
}
