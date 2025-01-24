"use client";

import { Scanner } from "@yudiel/react-qr-scanner";
import { useState } from "react";
import { db } from "@/firebase"; // Ensure your Firebase config is correctly set up
import { collection, getDocs, query, where, DocumentData } from "firebase/firestore";

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
  date: string;
}

export default function Home() {
  const [paymentID, setPaymentID] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<Metadata | null>(null);

  const checkPaymentStatus = async (id: string) => {
    try {
      const customersRef = collection(db, "customers");
      const customersSnapshot = await getDocs(customersRef);

      let paymentFound = false;

      for (const customerDoc of customersSnapshot.docs) {
        const customerID = customerDoc.id;
        const paymentsRef = collection(db, `customers/${customerID}/payments`);
        const paymentQuery = query(paymentsRef, where("__name__", "==", id));

        const paymentSnapshot = await getDocs(paymentQuery);
        if (!paymentSnapshot.empty) {
          const paymentData = paymentSnapshot.docs[0].data() as DocumentData;

          if (paymentData.status === "succeeded") {
            setPaymentStatus("succeeded");
            setMetadata(paymentData.metadata as Metadata);
          } else {
            setPaymentStatus("failed");
            setMetadata(null);
          }
          paymentFound = true;
          break;
        }
      }

      if (!paymentFound) {
        setPaymentStatus("not_found");
        setMetadata(null);
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
      setPaymentStatus("error");
      setMetadata(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 p-4">
      <div className="h-52 w-52">
        {/* QR Scanner */}
        <Scanner
          onScan={(result) => {
            const scannedID = result[0].rawValue;
            setPaymentID(scannedID);
            checkPaymentStatus(scannedID);
          }}
          onError={(err) => console.error("Scanner Error:", err)}
        />
      </div>

      {/* Display Payment ID */}
      <h1 className="text-white mt-4">Payment ID: {paymentID || "Scanning..."}</h1>

      {/* Display Payment Status */}
      {paymentStatus && (
        <div className="mt-6">
          {paymentStatus === "succeeded" && (
            <div className="text-green-500 text-lg flex flex-col items-center">
              <span>✅ Payment Succeeded</span>
                <div className="bg-gray-700 text-white p-4 mt-4 rounded-lg">
                  <h2 className="text-lg font-bold mb-2">Metadata:</h2>
                  <p>First Name: {metadata?.firstName}</p>
                  <p>Last Name: {metadata?.lastName}</p>
                  <p>Height: {metadata?.height}</p>
                  <p>Weight: {metadata?.weight}</p>
                  <p>Age: {metadata?.age}</p>
                  <p>Head Circumference: {metadata?.head}</p>
                  <p>Waist Circumference: {metadata?.waist}</p>
                  <p>Thigh Circumference: {metadata?.thigh}</p>
                  <p>Leg Length: {metadata?.leg}</p>
                  <p>Shoulder Width: {metadata?.shoulder}</p>
                  <p>Shoe Size: {metadata?.shoe}</p>
                  <p>Booking Date: {metadata?.date}</p>
                </div>
            </div>
          )}
          {paymentStatus === "failed" && (
            <div className="text-red-500 text-lg">❌ Payment Failed</div>
          )}
          {paymentStatus === "not_found" && (
            <div className="text-yellow-500 text-lg">⚠️ Payment Not Found</div>
          )}
          {paymentStatus === "error" && (
            <div className="text-red-500 text-lg">❌ Error Checking Payment</div>
          )}
        </div>
      )}
    </div>
  );
}
