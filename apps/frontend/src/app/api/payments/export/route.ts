
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const format = searchParams.get('format') || 'json';

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://0.0.0.0:3001';
    const response = await fetch(`${backendUrl}/api/payments/transactions?userId=${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }

    const data = await response.json();
    const transactions = data.data || [];

    if (format === 'csv') {
      const csv = [
        ['Date', 'Type', 'Amount', 'Status', 'Description'].join(','),
        ...transactions.map((tx: any) => 
          [tx.date, tx.type, tx.amount, tx.status, tx.description].join(',')
        )
      ].join('\n');

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="payment-history-${userId}.csv"`
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: transactions,
      exportDate: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Export failed' },
      { status: 500 }
    );
  }
}
