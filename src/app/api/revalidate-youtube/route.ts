import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function GET(request: NextRequest) {
    const secret = request.nextUrl.searchParams.get('secret');

    // Um segredo simples para evitar que qualquer um limpe seu cache
    if (secret !== process.env.REVALIDATION_SECRET && process.env.NODE_ENV === 'production') {
        return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }

    try {
        console.log('Revalidating youtube-data tag...');
        // @ts-ignore - Next.js types might mismatch in this version
        revalidateTag('youtube-data');
        return NextResponse.json({ revalidated: true, now: Date.now() });
    } catch (err) {
        return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
    }
}
