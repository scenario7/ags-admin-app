"use client";
import React, { useEffect, useState } from "react";
import { collection, addDoc, deleteDoc, getDocs, doc } from "firebase/firestore";
import { db } from "@/firebase";

// Helper to format date to readable form
const formatDate = (input: string) => {
  const date = new Date(input);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const AdminBookingDates = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [dates, setDates] = useState<{ id: string; date: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchDates = async () => {
    const snapshot = await getDocs(collection(db, "bookingDates"));
    const fetchedDates = snapshot.docs.map((doc) => {
      const timestamp = doc.data().date;
  
      // Convert Firestore Timestamp to JS Date
      const jsDate = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  
      return {
        id: doc.id,
        date: formatDate(jsDate.toISOString()),
      };
    });
    setDates(fetchedDates);
  };
  
  const handleAddDate = async () => {
    if (!selectedDate) return;

    const formatted = formatDate(selectedDate);

    // Prevent duplicates
    if (dates.some((d) => d.date === formatted)) {
      setMessage({ type: "error", text: "Date already exists." });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      await addDoc(collection(db, "bookingDates"), {
        date: new Date(selectedDate), // Store as Timestamp
      });
            setMessage({ type: "success", text: "Date added successfully." });
      setSelectedDate("");
      fetchDates();
      console.log("success")
    } catch (error) {
      console.error("Error adding date:", error);
      setMessage({ type: "error", text: "Failed to add date." });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDate = async (id: string) => {
    try {
      await deleteDoc(doc(db, "bookingDates", id));
      setMessage({ type: "success", text: "Date removed." });
      fetchDates();
    } catch (error) {
      console.error("Error deleting date:", error);
      setMessage({ type: "error", text: "Failed to delete date." });
    }
  };

  useEffect(() => {
    fetchDates();
  }, []);

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Manage Booking Dates</h1>

      {message && (
        <div
          className={`mb-4 p-3 rounded-md text-sm ${
            message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex gap-4 mb-6 items-center">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="flex-1 border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleAddDate}
          disabled={loading || !selectedDate}
          className={`px-4 py-2 rounded-md text-white ${
            loading || !selectedDate
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Adding..." : "Add Date"}
        </button>
      </div>

      {dates.length === 0 ? (
        <p className="text-gray-500">No dates available.</p>
      ) : (
        <ul className="space-y-2">
          {dates.map(({ id, date }) => (
            <li key={id} className="flex justify-between items-center text-black font-semibold bg-gray-100 p-3 rounded-md">
              <span>{date}</span>
              <button
                onClick={() => handleDeleteDate(id)}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminBookingDates;
