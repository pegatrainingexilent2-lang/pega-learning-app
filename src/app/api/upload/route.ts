import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function POST(request: Request): Promise<NextResponse> {
    const body = (await request.json()) as HandleUploadBody;

    try {
        const jsonResponse = await handleUpload({
            body,
            request,
            onBeforeGenerateToken: async (pathname) => {
                const session = await auth();

                // Block unauthorized access - only admin can upload
                if (!session?.user?.email || session.user.email !== 'pegatraining.exilent2@gmail.com') {
                    throw new Error("Unauthorized");
                }

                return {
                    allowedContentTypes: [
                        'application/pdf',
                        'application/vnd.ms-powerpoint',
                        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
                    ],
                    tokenPayload: JSON.stringify({
                        uploadedBy: session.user.email,
                    }),
                };
            },
            onUploadCompleted: async ({ blob, tokenPayload }) => {
                console.log('Upload completed:', blob.url);
            },
        });

        return NextResponse.json(jsonResponse);
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 400 },
        );
    }
}
