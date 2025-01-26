import React from 'react'

export default function Dashboard() {
    return (
        <div className="h-[120vh]">
            <div className="space-y-6">
                <h1 className="text-4xl font-bold">Welcome to IFRS 16 Solution</h1>
                <p className="text-lg text-gray-700">
                    This is the main content area. Use it to display your page content.
                </p>
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded shadow">Content Block 1</div>
                    <div className="bg-white p-4 rounded shadow">Content Block 2</div>
                    <div className="bg-white p-4 rounded shadow">Content Block 3</div>
                </div>
            </div>
        </div>
    )
}
