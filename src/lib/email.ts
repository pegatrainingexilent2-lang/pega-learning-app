import nodemailer from 'nodemailer';

// Use environment variables for sensitive info
const EMAIL_USER = process.env.EMAIL_USER; // Your Gmail: pegatraining.exilent2@gmail.com
const EMAIL_PASS = process.env.EMAIL_PASS; // Your App Password

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});

export async function sendAdminNotification(email: string, name?: string) {
    console.log('>>> Sending admin notification for:', email);
    try {
        await transporter.sendMail({
            from: `"PegaLearn System" <${EMAIL_USER}>`,
            to: EMAIL_USER,
            subject: 'New User Signup Pending Approval - PegaLearn',
            html: `
                <h2>New User Signup</h2>
                <p>A new user has signed up and is waiting for your approval.</p>
                <ul>
                    <li><strong>Email:</strong> ${email}</li>
                    <li><strong>Name:</strong> ${name || 'Not provided'}</li>
                </ul>
                <p>Login to your admin dashboard to approve them: <a href="https://pega-learning-app1.vercel.app/admin/approvals">Approve User</a></p>
            `,
        });
        console.log('>>> Admin notification sent.');
    } catch (error) {
        console.error('>>> Failed to send admin notification:', error);
    }
}

export async function sendUserApprovalEmail(userEmail: string, userName?: string) {
    console.log('>>> Sending approval email to:', userEmail);
    try {
        await transporter.sendMail({
            from: `"PegaLearn" <${EMAIL_USER}>`,
            to: userEmail,
            subject: 'Account Approved - Welcome to PegaLearn!',
            html: `
                <h2>Welcome to PegaLearn, ${userName || 'User'}!</h2>
                <p>Great news! Your account has been approved by the administrator.</p>
                <p>You can now log in and start your Pega 25.1 journey.</p>
                <a href="https://pega-learning-app1.vercel.app/login" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">Login Now</a>
            `,
        });
        console.log('>>> User approval email sent.');
    } catch (error) {
        console.error('>>> Failed to send user approval email:', error);
    }
}

export async function sendPasswordResetEmail(userEmail: string, resetLink: string) {
    console.log('>>> Attempting to send reset email via Gmail to:', userEmail);
    try {
        const info = await transporter.sendMail({
            from: `"PegaLearn Support" <${EMAIL_USER}>`,
            to: userEmail,
            subject: 'Reset Your Password - PegaLearn',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
                    <h2 style="color: #1e1b4b; margin-bottom: 24px;">Password Reset Request</h2>
                    <p style="color: #475569; line-height: 1.6;">You requested to reset your password for your PegaLearn account.</p>
                    <p style="color: #475569; line-height: 1.6;">Click the button below to set a new password. This link will expire in 1 hour.</p>
                    <div style="text-align: center; margin: 32px 0;">
                        <a href="${resetLink}" style="display: inline-block; padding: 14px 28px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.4);">Reset Password</a>
                    </div>
                    <p style="color: #94a3b8; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
                    <p style="font-size: 12px; color: #94a3b8; margin-bottom: 8px;">If the button doesn't work, copy and paste this link into your browser:</p>
                    <p style="font-size: 12px; color: #4f46e5; word-break: break-all;">${resetLink}</p>
                </div>
            `,
        });
        console.log('>>> Gmail Send Info:', info);
    } catch (error: any) {
        console.error('>>> CRITICAL: Failed to send password reset email via Gmail:', error.message);
        throw error;
    }
}
