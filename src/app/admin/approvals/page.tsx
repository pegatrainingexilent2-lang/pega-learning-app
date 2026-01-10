"use client";

import { useEffect, useState } from "react";
import { User } from "@prisma/client";
import { CheckCircle, XCircle, Clock, Search, ShieldCheck } from "lucide-react";

export default function ApprovalsPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/approvals');
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (userId: string) => {
        setProcessingId(userId);
        try {
            const res = await fetch('/api/admin/approvals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, approve: true })
            });

            if (res.ok) {
                setUsers(prev => prev.filter(u => u.id !== userId));
            } else {
                alert("Failed to approve user");
            }
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#f0f4f8]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-8">
            <header className="mb-12">
                <div className="flex items-center gap-3 mb-2">
                    <ShieldCheck className="w-8 h-8 text-indigo-600" />
                    <h1 className="text-3xl font-bold text-gray-900">Admin Pending Approvals</h1>
                </div>
                <p className="text-gray-600">Review and approve new user registration requests.</p>
            </header>

            <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-indigo-100/30 overflow-hidden">
                {users.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Clock className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Clean Slate!</h3>
                        <p className="text-gray-500">No pending approval requests at the moment.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#f5f7ff] border-b border-indigo-100/50">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">User Details</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">Signed Up</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-6">
                                            <div className="font-bold text-gray-900">{user.name}</div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-6 text-sm text-gray-500 font-mono">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <button
                                                onClick={() => handleApprove(user.id)}
                                                disabled={processingId === user.id}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-all shadow-sm active:scale-95 disabled:opacity-50"
                                            >
                                                {processingId === user.id ? (
                                                    "Approving..."
                                                ) : (
                                                    <>
                                                        <CheckCircle className="w-4 h-4" />
                                                        Approve
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
