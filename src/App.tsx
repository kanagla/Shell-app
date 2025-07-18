import React, { useEffect, Suspense } from "react";

const CartPage = React.lazy(() => import("ordersApp/CartPage"));

export default function App() {
  const user = {
    name: "Surya",
    role: "admin",
  };

useEffect(() => {
  const iframe = document.getElementById("bookstore-iframe") as HTMLIFrameElement;
  if (!iframe) return;
  iframe.addEventListener("load", () => {
    console.log("✅ iframe loaded, sending message");
    setTimeout(() => {
      iframe.contentWindow?.postMessage(
        {
          type: "SET_USER",
          payload: {
            name: "Surya",
            role: "admin",
          },
        },
        "http://localhost:3000"
      );
    }, 500); 
  });
}, []);


  return (
    <div>
      <h1>Shell App</h1>

      <Suspense fallback={<div>Loading Cart Page...</div>}>
        <CartPage />
      </Suspense>

      <h2>📦 Loaded from Bookstore App (via iframe)</h2>

    </div>
  );
}

