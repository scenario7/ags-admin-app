"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import logo from '@/public/images/AGSWhiteLogo.png'

interface Metadata {
  firstName: string;
  lastName: string;
  height: string;
  weight: string;
  age: string;
  head: string;
  waist: string;
  thigh: string;
  leg: string;
  shoulder: string;
  shoe: string;
  bookingDate: string;
}

export default function Bookings() {
  const [successfulPayments, setSuccessfulPayments] = useState<{ id: string; metadata: Metadata }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuccessfulPayments = async () => {
      try {
        const customersRef = collection(db, "customers");
        const customersSnapshot = await getDocs(customersRef);
        const paymentsList: { id: string; metadata: Metadata }[] = [];

        for (const customerDoc of customersSnapshot.docs) {
          const customerID = customerDoc.id;
          const paymentsRef = collection(db, `customers/${customerID}/payments`);
          const paymentsSnapshot = await getDocs(paymentsRef);

          paymentsSnapshot.docs.forEach((doc) => {
            const paymentData = doc.data();
            if (paymentData.status === "succeeded") {
              paymentsList.push({ id: doc.id, metadata: paymentData.metadata as Metadata });
            }
          });
        }

        setSuccessfulPayments(paymentsList);
      } catch (error) {
        console.error("Error fetching successful payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuccessfulPayments();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-800 p-6 text-white">
        <img src={logo.src} alt="" className="h-20"/>
      <h1 className="text-2xl font-bold mb-4 py-10">Successful Bookings</h1>
      {loading ? (
        <p>Loading...</p>
      ) : successfulPayments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {successfulPayments.map(({ id, metadata }) => (
            <div key={id} className="bg-gray-700 p-4 rounded-lg">
              <h2 className="text-lg font-bold">Payment ID: {id}</h2>
              <p>First Name: {metadata.firstName}</p>
              <p>Last Name: {metadata.lastName}</p>
              <p>Height: {metadata.height}</p>
              <p>Weight: {metadata.weight}</p>
              <p>Age: {metadata.age}</p>
              <p>Head Circumference: {metadata.head}</p>
              <p>Waist Circumference: {metadata.waist}</p>
              <p>Thigh Circumference: {metadata.thigh}</p>
              <p>Leg Length: {metadata.leg}</p>
              <p>Shoulder Width: {metadata.shoulder}</p>
              <p>Shoe Size: {metadata.shoe}</p>
              <p>Booking Date: {metadata.bookingDate}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No successful bookings found.</p>
      )}
    </div>
  );
}
