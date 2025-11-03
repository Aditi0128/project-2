import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { motion, AnimatePresence } from "framer-motion";

export default function BillGenerator() {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null); // For modal

  // Fetch menu items
  useEffect(() => {
    const fetchMenu = async () => {
      const snap = await getDocs(collection(db, "menuItems"));
      setMenuItems(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchMenu();
  }, []);

  // Listen to bills
  useEffect(() => {
    const q = query(collection(db, "bills"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setBills(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, []);

  // Add item
  const handleAddItem = (item) => {
    setSelectedItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing)
        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        );
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const handleQtyChange = (id, qty) => {
    setSelectedItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: parseInt(qty) || 0 } : i))
    );
  };

  const handleRemoveItem = (id) =>
    setSelectedItems((prev) => prev.filter((i) => i.id !== id));

  const subtotal = selectedItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const gst = subtotal * 0.05;
  const total = subtotal + gst;

  // Save bill + PDF
  const handleSaveBill = async () => {
    if (!name || !phone || selectedItems.length === 0)
      return alert("Enter name, phone, and select at least one item.");

    const billData = {
      name,
      phone,
      items: selectedItems.map((i) => ({
        name: i.name,
        price: i.price,
        qty: i.qty,
      })),
      subtotal,
      gst,
      total,
      restaurant: "Hotel Rajsik",
      createdAt: serverTimestamp(),
      date: new Date().toISOString().split("T")[0],
    };

    const docRef = await addDoc(collection(db, "bills"), billData);
    generatePDF(billData, docRef.id);
    setName("");
    setPhone("");
    setSelectedItems([]);
  };

  // PDF Generator
  const generatePDF = (bill, id) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Hotel Rajsik", 14, 20);

    doc.setFontSize(12);
    doc.text(`Bill No: ${id}`, 14, 30);
    doc.text(`Date: ${bill.date}`, 150, 30);
    doc.text(`Name: ${bill.name}`, 14, 40);
    doc.text(`Phone: ${bill.phone}`, 14, 47);

    const rows = bill.items.map((i) => [
      i.name,
      i.qty,
      `₹${i.price}`,
      `₹${(i.price * i.qty).toFixed(2)}`,
    ]);

    doc.autoTable({
      startY: 55,
      head: [["Item", "Qty", "Price", "Total"]],
      body: rows,
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text(`Subtotal: ₹${bill.subtotal.toFixed(2)}`, 130, finalY);
    doc.text(`GST (5%): ₹${bill.gst.toFixed(2)}`, 130, finalY + 7);
    doc.text(`Grand Total: ₹${bill.total.toFixed(2)}`, 130, finalY + 14);

    doc.save(`Bill_${bill.name}_${bill.date}.pdf`);
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-amber-100 p-8">
      <h1 className="text-3xl font-bold text-rose-700 mb-6">
        Billing Dashboard
      </h1>

      {/* -------- New Bill Form -------- */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-rose-600">
          Create New Bill
        </h2>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Customer Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">
            Select Items
          </label>
          <div className="flex flex-wrap gap-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleAddItem(item)}
                className="px-3 py-2 bg-rose-100 hover:bg-rose-200 rounded-lg text-sm"
              >
                {item.name} - ₹{item.price}
              </button>
            ))}
          </div>
        </div>

        {selectedItems.length > 0 && (
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-left border">
              <thead className="bg-rose-600 text-white">
                <tr>
                  <th className="p-2">Item</th>
                  <th className="p-2">Qty</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {selectedItems.map((i) => (
                  <tr key={i.id} className="border-b">
                    <td className="p-2">{i.name}</td>
                    <td className="p-2">
                      <input
                        type="number"
                        min="1"
                        value={i.qty}
                        onChange={(e) => handleQtyChange(i.id, e.target.value)}
                        className="w-16 p-1 border rounded"
                      />
                    </td>
                    <td className="p-2">₹{i.price}</td>
                    <td className="p-2">₹{(i.price * i.qty).toFixed(2)}</td>
                    <td className="p-2">
                      <button
                        onClick={() => handleRemoveItem(i.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="text-right space-y-1 mb-4">
          <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
          <p>GST (5%): ₹{gst.toFixed(2)}</p>
          <p className="font-bold text-lg">Total: ₹{total.toFixed(2)}</p>
        </div>

        <button
          onClick={handleSaveBill}
          className="px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
        >
          Save & Download Bill
        </button>
      </div>

      {/* -------- Bill History -------- */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-rose-600">
          Bill History
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-rose-600 text-white">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((b) => (
                <tr key={b.id} className="border-b hover:bg-amber-50">
                  <td className="p-3">{b.name}</td>
                  <td className="p-3">{b.phone}</td>
                  <td className="p-3">{b.date}</td>
                  <td className="p-3 font-semibold text-rose-700">
                    ₹{b.total?.toFixed(2)}
                  </td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => setSelectedBill(b)}
                      className="px-3 py-1 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
                    >
                      View
                    </button>
                    <button
                      onClick={() => generatePDF(b, b.id)}
                      className="px-3 py-1 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {bills.length === 0 && (
            <p className="text-center text-gray-600 py-6">
              No bills found yet.
            </p>
          )}
        </div>
      </div>

      {/* -------- Modal for Viewing Bill Details -------- */}
      <AnimatePresence>
        {selectedBill && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedBill(null)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-semibold text-rose-700 mb-4">
                Bill Details
              </h3>
              <p>
                <strong>Name:</strong> {selectedBill.name}
              </p>
              <p>
                <strong>Phone:</strong> {selectedBill.phone}
              </p>
              <p>
                <strong>Date:</strong> {selectedBill.date}
              </p>
              <div className="overflow-x-auto mt-4 mb-3">
                <table className="w-full text-left border">
                  <thead className="bg-rose-600 text-white">
                    <tr>
                      <th className="p-2">Item</th>
                      <th className="p-2">Qty</th>
                      <th className="p-2">Price</th>
                      <th className="p-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedBill.items?.map((i, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="p-2">{i.name}</td>
                        <td className="p-2">{i.qty}</td>
                        <td className="p-2">₹{i.price}</td>
                        <td className="p-2">₹{(i.price * i.qty).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-right space-y-1">
                <p>Subtotal: ₹{selectedBill.subtotal?.toFixed(2)}</p>
                <p>GST (5%): ₹{selectedBill.gst?.toFixed(2)}</p>
                <p className="font-bold text-lg">
                  Total: ₹{selectedBill.total?.toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => setSelectedBill(null)}
                className="mt-4 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 w-full"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
