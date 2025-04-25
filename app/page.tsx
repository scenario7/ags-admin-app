import React from 'react'

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white space-y-4">
      <h1 className="text-3xl font-bold mb-6">Welcome</h1>
      <a
        href="/scanner"
        className="px-6 py-3 bg-white text-gray-900 rounded-2xl shadow hover:bg-gray-200 transition"
      >
        Scan and Verify Ticket
      </a>
      <a
        href="/available-dates"
        className="px-6 py-3 bg-white text-gray-900 rounded-2xl shadow hover:bg-gray-200 transition"
      >
        Modify Available Booking Dates
      </a>
      <a
        href="/bookings"
        className="px-6 py-3 bg-white text-gray-900 rounded-2xl shadow hover:bg-gray-200 transition"
      >
        View Customer Booking Database
      </a>
    </div>
  )
}

export default Home
