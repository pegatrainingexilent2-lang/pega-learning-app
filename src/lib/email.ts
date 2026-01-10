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

export async function sendPasswordResetEmail(userEmail: string, resetLink: string) {
    try {
        await resend.emails.send({
            from: 'PegaLearn <onboarding@resend.dev>',
            to: userEmail,
            subject: 'Reset Your Password - PegaLearn',
            html: `
                <h2>Password Reset Request</h2>
                <p>You requested to reset your password for your PegaLearn account.</p>
                <p>Click the button below to set a new password. This link will expire in 1 hour.</p>
                <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">Reset Password</a>
                <p>If you didn't request this, you can safely ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #666;">If the button doesn't work, copy and paste this link into your browser:</p>
                <p style="font-size: 12px; color: #4f46e5;">${resetLink}</p>
            `,
        });
    } catch (error) {
        console.error('Failed to send password reset email:', error);
    }
}
