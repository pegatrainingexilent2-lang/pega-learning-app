import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = 'pegatraining.exilent2@gmail.com';

export async function sendAdminNotification(userEmail: string, userName: string) {
    try {
        await resend.emails.send({
            from: 'PegaLearn <onboarding@resend.dev>',
            to: ADMIN_EMAIL,
            subject: 'New User Signup - Approval Required',
            html: `
                <h2>New Signup Request</h2>
                <p>A new user has signed up and is waiting for your approval.</p>
                <ul>
                    <li><strong>Name:</strong> ${userName}</li>
                    <li><strong>Email:</strong> ${userEmail}</li>
                </ul>
                <p>Please log in to your dashboard to approve this user.</p>
            `,
        });
    } catch (error) {
        console.error('Failed to send admin notification email:', error);
    }
}

export async function sendUserApprovalEmail(userEmail: string, userName: string) {
    try {
        await resend.emails.send({
            from: 'PegaLearn <onboarding@resend.dev>',
            to: userEmail,
            subject: 'Application Approved - Welcome to PegaLearn!',
            html: `
                <h2>Congratulations ${userName}!</h2>
                <p>Your account has been approved by the administrator.</p>
                <p>You can now log in and start learning.</p>
                <a href="${process.env.NEXTAUTH_URL}/login" style="padding: 10px 20px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 5px;">Login Now</a>
            `,
        });
    } catch (error) {
        console.error('Failed to send user approval email:', error);
    }
}
