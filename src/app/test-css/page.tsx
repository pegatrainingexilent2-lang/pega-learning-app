export default function TestCSS() {
    return (
        <div className="min-h-screen p-8">
            <h1 className="text-3xl font-bold mb-8">CSS Test Page</h1>

            <div className="space-y-8">
                {/* Test 1: Gradient Mesh */}
                <div className="border p-4 rounded">
                    <h2 className="text-xl font-bold mb-2">Test 1: Gradient Mesh</h2>
                    <div className="relative h-40 bg-gray-100 rounded overflow-hidden">
                        <div className="gradient-mesh" />
                        <p className="relative z-10 p-4">If you see animated gradient blobs, gradient-mesh is working</p>
                    </div>
                </div>

                {/* Test 2: Dot Grid */}
                <div className="border p-4 rounded">
                    <h2 className="text-xl font-bold mb-2">Test 2: Dot Grid</h2>
                    <div className="h-40 dot-grid bg-white rounded">
                        <p className="p-4">If you see a dot pattern, dot-grid is working</p>
                    </div>
                </div>

                {/* Test 3: Glassmorphism */}
                <div className="border p-4 rounded">
                    <h2 className="text-xl font-bold mb-2">Test 3: Glassmorphism</h2>
                    <div className="relative h-40 bg-gradient-to-r from-purple-400 to-pink-400 rounded overflow-hidden">
                        <div className="glass absolute inset-4 rounded-lg p-4">
                            <p>If this has a frosted glass effect, glassmorphism is working</p>
                        </div>
                    </div>
                </div>

                {/* Test 4: Premium Card */}
                <div className="border p-4 rounded">
                    <h2 className="text-xl font-bold mb-2">Test 4: Premium Card (hover me)</h2>
                    <div className="premium-card h-40 bg-white rounded-lg p-4 shadow-lg">
                        <p>Hover over this card - you should see a gradient border appear</p>
                    </div>
                </div>

                {/* Test 5: Pulse Glow */}
                <div className="border p-4 rounded">
                    <h2 className="text-xl font-bold mb-2">Test 5: Pulse Glow</h2>
                    <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
                        <div className="w-32 h-32 bg-purple-500 rounded-full pulse-glow"></div>
                    </div>
                </div>

                {/* Test 6: Gradient Text */}
                <div className="border p-4 rounded">
                    <h2 className="text-xl font-bold mb-2">Test 6: Gradient Text</h2>
                    <h3 className="text-4xl font-bold gradient-text">This text should have an animated gradient</h3>
                </div>

                {/* Test 7: CSS Variables */}
                <div className="border p-4 rounded">
                    <h2 className="text-xl font-bold mb-2">Test 7: CSS Variables</h2>
                    <div className="space-y-2">
                        <div className="h-8 rounded" style={{ background: 'var(--gradient-primary-start)' }}>Primary Start</div>
                        <div className="h-8 rounded" style={{ background: 'var(--gradient-secondary-start)' }}>Secondary Start</div>
                        <div className="h-8 rounded" style={{ background: 'var(--gradient-accent-start)' }}>Accent Start</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
