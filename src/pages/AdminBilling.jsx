// src/pages/AdminBilling.jsx
import { useEffect, useState, useRef } from "react";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useSearchParams } from "react-router-dom";

export default function AdminBilling() {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const billRef = useRef();
  const [searchParams] = useSearchParams();

  // pre-fill from URL if opened via "Generate Bill" button
  useEffect(() => {
    const name = searchParams.get("customer");
    const phone = searchParams.get("phone");
    if (name) setCustomerName(name);
    if (phone) setCustomerPhone(phone);
  }, [searchParams]);

  // fetch menuItems from Firestore
  useEffect(() => {
    const fetchMenu = async () => {
      const querySnap = await getDocs(collection(db, "menuItems"));
      const items = querySnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMenuItems(items);
      setLoading(false);
    };
    fetchMenu();
  }, []);

  const handleAddItem = (itemId) => {
    const item = menuItems.find((i) => i.id === itemId);
    if (item) {
      setSelectedItems((prev) => [
        ...prev,
        { ...item, qty: 1, total: item.price },
      ]);
    }
  };

  const handleQtyChange = (index, qty) => {
    const updated = [...selectedItems];
    updated[index].qty = qty;
    updated[index].total = qty * updated[index].price;
    setSelectedItems(updated);
  };

  const handleRemoveItem = (index) => {
    setSelectedItems((prev) => prev.filter((_, i) => i !== index));
  };

  const subtotal = selectedItems.reduce((sum, item) => sum + item.total, 0);
  const gst = subtotal * 0.05; // 5% GST
  const grandTotal = subtotal + gst;

  const handleSaveBill = async () => {
    if (!customerName || !customerPhone || selectedItems.length === 0) {
      alert("Please fill all details and select at least one item.");
      return;
    }

    await addDoc(collection(db, "bills"), {
      customerName,
      customerPhone,
      items: selectedItems,
      subtotal,
      gst,
      grandTotal,
      createdAt: serverTimestamp(),
      restaurant: "Hotel Rajshik",
    });

    alert("✅ Bill saved successfully!");
    setCustomerName("");
    setCustomerPhone("");
    setSelectedItems([]);
  };

  const handleDownloadPDF = async () => {
    const input = billRef.current;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 190;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 10;

    pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`Bill_${customerName}.pdf`);
  };

  if (loading)
    return (
      <div className="p-6 text-center text-gray-600">Loading menu items...</div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded-lg min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-6 text-orange-600">
        Admin Billing - Hotel Rajshik
      </h1>

      {/* Customer Details */}
      <div className="mb-4 flex flex-col sm:flex-row gap-4 justify-between">
        <input
          type="text"
          placeholder="Customer Name"
          className="border rounded p-2 flex-1"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Customer Phone"
          className="border rounded p-2 flex-1"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
        />
        <select
          className="border rounded p-2 flex-1"
          onChange={(e) => handleAddItem(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>
            Select Item
          </option>
          {menuItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} - ₹{item.price}
            </option>
          ))}
        </select>
      </div>

      {/* Bill Preview */}
      <div ref={billRef} className="border p-4 rounded-lg bg-gray-50">
        <h2 className="text-xl font-semibold mb-3 text-orange-700">
          Bill Details
        </h2>

        {selectedItems.length === 0 ? (
          <p className="text-gray-500 italic">No items added yet.</p>
        ) : (
          <table className="w-full border">
            <thead className="bg-orange-100">
              <tr>
                <th className="p-2 border">Item</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Qty</th>
                <th className="p-2 border">Total</th>
                <th className="p-2 border">Remove</th>
              </tr>
            </thead>
            <tbody>
              {selectedItems.map((item, index) => (
                <tr key={index}>
                  <td className="p-2 border">{item.name}</td>
                  <td className="p-2 border">₹{item.price}</td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) =>
                        handleQtyChange(index, Number(e.target.value))
                      }
                      className="w-16 border rounded p-1 text-center"
                    />
                  </td>
                  <td className="p-2 border">₹{item.total.toFixed(2)}</td>
                  <td className="p-2 border text-center">
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {selectedItems.length > 0 && (
          <div className="mt-4 text-right space-y-1">
            <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
            <p>GST (5%): ₹{gst.toFixed(2)}</p>
            <p className="font-bold text-lg">
              Grand Total: ₹{grandTotal.toFixed(2)}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end mt-6 gap-3">
        <button
          onClick={handleSaveBill}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
        >
          Save Bill
        </button>
        <button
          onClick={handleDownloadPDF}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}
