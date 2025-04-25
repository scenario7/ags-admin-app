"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import logo from '@/public/images/AGSWhiteLogo.png';

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

interface StripeItem {
  description: string;
  quantity: number;
  price: {
    unit_amount: number;
    currency: string;
    nickname?: string;
  };
}

interface Payment {
  id: string;
  metadata: Metadata;
  items?: StripeItem[];
  email?: string;
}

export default function Bookings() {
  const [successfulPayments, setSuccessfulPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuccessfulPayments = async () => {
      try {
        const customersRef = collection(db, "customers");
        const customersSnapshot = await getDocs(customersRef);
        const paymentsList: Payment[] = [];

        for (const customerDoc of customersSnapshot.docs) {
          const customerID = customerDoc.id;
          const paymentsRef = collection(db, `customers/${customerID}/payments`);
          const paymentsSnapshot = await getDocs(paymentsRef);

          paymentsSnapshot.docs.forEach((doc) => {
            const paymentData = doc.data();
            if (paymentData.status === "succeeded") {
              const email = paymentData.charges?.data?.[0]?.billing_details?.email || "";

              const payment: Payment = {
                id: doc.id,
                metadata: paymentData.metadata as Metadata,
                items: paymentData.items || [],
                email,
              };
              paymentsList.push(payment);
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
    <div className="min-h-screen bg-gray-950 text-white px-6 py-12 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <img src={logo.src} alt="Logo" className="h-24 mb-8 drop-shadow-lg" />
        <h1 className="text-4xl font-extrabold tracking-tight mb-12 text-center">
          Successful Bookings
        </h1>

        {loading ? (
          <p className="text-lg text-gray-400 animate-pulse">Loading...</p>
        ) : successfulPayments.length > 0 ? (
          <div className="grid gap-10 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-full">
            {successfulPayments.map(({ id, metadata, items, email }) => (
              <div
                key={id}
                className="bg-gray-900 p-6 rounded-2xl shadow-xl transition hover:scale-[1.02] duration-300 border border-gray-800"
              >
                <h2 className="text-xl font-semibold mb-4 text-white/90">
                  Payment ID: <span className="text-white/70">{id}</span>
                </h2>
                <div className="text-sm space-y-1 text-gray-300 leading-6">
                  <p><strong>First Name:</strong> {metadata.firstName}</p>
                  <p><strong>Last Name:</strong> {metadata.lastName}</p>
                  {email && <p><strong>Email:</strong> {email}</p>}
                  <p><strong>Age:</strong> {metadata.age}</p>
                  <p><strong>Height:</strong> {metadata.height}</p>
                  <p><strong>Weight:</strong> {metadata.weight}</p>
                  <p><strong>Head Circumference:</strong> {metadata.head}</p>
                  <p><strong>Waist:</strong> {metadata.waist}</p>
                  <p><strong>Thigh:</strong> {metadata.thigh}</p>
                  <p><strong>Leg Length:</strong> {metadata.leg}</p>
                  <p><strong>Shoulder Width:</strong> {metadata.shoulder}</p>
                  <p><strong>Shoe Size:</strong> {metadata.shoe}</p>
                  <p><strong>Booking Date:</strong> {metadata.bookingDate}</p>
                </div>

                {items && items.length > 0 && (
                  <div className="mt-4 text-sm text-gray-200">
                    <h3 className="font-semibold mb-1">Items:</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {items.map((item, index) => (
                        <li key={index}>{item.description}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {email && (
                  <div className="mt-6">
                    <a
                      href={`mailto:${email}?subject=Regarding Your Booking&body=Hi ${metadata.firstName},%0D%0A%0D%0AThank you for your booking!`}
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
                    >
                      Email Customer
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No successful bookings found.</p>
        )}
      </div>
    </div>
  );
}
