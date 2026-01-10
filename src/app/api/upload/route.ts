import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function POST(request: Request): Promise<NextResponse> {
    const session = await auth();

    // Block unauthorized access - only admin can upload
    if (!session?.user?.email || session.user.email !== 'pegatraining.exilent2@gmail.com') {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
        return NextResponse.json({ error: "Filename is required" }, { status: 400 });
    }

    try {
        if (!request.body) {
            return NextResponse.json({ error: "Body is required" }, { status: 400 });
        }

        const blob = await put(filename, request.body, {
            access: 'public',
        });

        return NextResponse.json(blob);
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
    }
}
