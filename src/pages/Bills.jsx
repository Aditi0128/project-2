import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export default function Bill() {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [invoiceCount, setInvoiceCount] = useState(0);

  useEffect(() => {
    const fetchMenu = async () => {
      const snap = await getDocs(collection(db, "menuItems"));
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMenuItems(data);
    };

    const fetchBills = async () => {
      const q = query(collection(db, "bills"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setInvoiceCount(snap.size);
    };

    fetchMenu();
    fetchBills();
  }, []);

  const handleAddItem = (item) => {
    const existing = selectedItems.find((i) => i.id === item.id);
    if (existing) {
      setSelectedItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setSelectedItems((prev) => [...prev, { ...item, quantity: 1 }]);
    }
  };

  const handleRemoveItem = (id) => {
    setSelectedItems((prev) => prev.filter((i) => i.id !== id));
  };

  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const gst = subtotal * 0.05;
  const total = subtotal + gst;

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory = category === "All" || item.category === category;
    return matchesSearch && matchesCategory;
  });

  const generateInvoiceNumber = () => {
    const today = new Date();
    const datePart = today.toISOString().slice(0, 10).replace(/-/g, "");
    const padded = String(invoiceCount + 1).padStart(3, "0");
    return `INV-${datePart}-${padded}`;
  };

  const handleGenerateBill = async () => {
    if (!customerName || !phone || selectedItems.length === 0) {
      alert("Please fill all details and add at least one item.");
      return;
    }

    const invoiceNumber = generateInvoiceNumber();
    const billData = {
      name: customerName,
      phone,
      items: selectedItems.map((i) => ({
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
      subtotal,
      gst,
      total,
      date: new Date().toISOString().slice(0, 10),
      invoiceNumber,
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "bills"), billData);
      generatePDF(billData);
      alert("Bill saved and PDF generated successfully!");
      setCustomerName("");
      setPhone("");
      setSelectedItems([]);
      setInvoiceCount((prev) => prev + 1);
    } catch (error) {
      console.error("Error saving bill:", error);
      alert("Failed to save bill. Try again.");
    }
  };

 const generatePDF = (bill) => {
   const doc = new jsPDF();

   // Use the imported autoTable function, not doc.autoTable
   // Header
   doc.setFont("helvetica", "bold");
   doc.setFontSize(24);
   doc.text("Hotel Rajsik", 105, 20, { align: "center" });

   doc.setFontSize(12);
   doc.setFont("helvetica", "normal");
   doc.text(`Invoice No: ${bill.invoiceNumber}`, 20, 35);
   doc.text(`Date: ${bill.date}`, 150, 35);
   doc.text(`Customer: ${bill.name}`, 20, 45);
   doc.text(`Phone: ${bill.phone}`, 150, 45);

   // Table
   const tableData = bill.items.map((i, idx) => [
     idx + 1,
     i.name,
     i.quantity,
     `₹${i.price}`,
     `₹${i.price * i.quantity}`,
   ]);

   autoTable(doc, {
     head: [["#", "Item", "Qty", "Rate", "Amount"]],
     body: tableData,
     startY: 55,
     theme: "grid",
     headStyles: { fillColor: [226, 83, 68] },
   });

   let finalY = doc.lastAutoTable.finalY + 10;
   doc.text(`Subtotal: ₹${bill.subtotal.toFixed(2)}`, 140, finalY);
   doc.text(`GST (5%): ₹${bill.gst.toFixed(2)}`, 140, finalY + 7);
   doc.setFont("helvetica", "bold");
   doc.text(`Total: ₹${bill.total.toFixed(2)}`, 140, finalY + 15);

   // Footer
   doc.setFontSize(11);
   doc.setFont("helvetica", "italic");
   doc.text("Thank you for dining with us!", 105, finalY + 35, {
     align: "center",
   });

   doc.save(`${bill.invoiceNumber}.pdf`);
 };

  return (
    <section className="p-8 bg-gradient-to-br from-amber-50 via-rose-50 to-amber-100 min-h-screen">
      <h1 className="text-4xl font-bold text-rose-700 mb-6 text-center">
        Bill Generator
      </h1>

      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        {/* Customer Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-rose-400"
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-rose-400"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
          <input
            type="text"
            placeholder="Search menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-3 border rounded-lg w-full sm:w-1/2 focus:ring-2 focus:ring-rose-400"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-rose-400"
          >
            <option>All</option>
            {[...new Set(menuItems.map((i) => i.category))].map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Menu Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-4 border rounded-xl shadow-sm bg-white hover:shadow-md transition"
            >
              <h3 className="font-semibold text-gray-800">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.category}</p>
              <p className="text-rose-600 font-bold">₹{item.price}</p>
              <button
                onClick={() => handleAddItem(item)}
                className="mt-2 px-3 py-1 bg-rose-600 text-white rounded-lg hover:bg-rose-700 text-sm"
              >
                Add
              </button>
            </div>
          ))}
        </div>

        {/* Selected Items */}
        {selectedItems.length > 0 && (
          <div className="border-t pt-4">
            <h2 className="text-2xl font-bold text-rose-700 mb-3">
              Selected Items
            </h2>
            <table className="w-full text-left mb-4">
              <thead>
                <tr className="text-gray-700 border-b">
                  <th className="py-2">Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {selectedItems.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-2">{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.price}</td>
                    <td>₹{item.price * item.quantity}</td>
                    <td>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-rose-500 hover:text-rose-700"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-right text-gray-700 space-y-1">
              <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
              <p>GST (5%): ₹{gst.toFixed(2)}</p>
              <p className="text-xl font-bold text-rose-700">
                Total: ₹{total.toFixed(2)}
              </p>
            </div>

            <div className="text-right mt-6">
              <button
                onClick={handleGenerateBill}
                className="px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 font-semibold"
              >
                Generate Bill
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
