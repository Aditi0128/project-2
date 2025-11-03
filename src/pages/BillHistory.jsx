import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function BillHistory() {
  const [bills, setBills] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchBills = async () => {
      const q = query(collection(db, "bills"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setBills(data);
    };
    fetchBills();
  }, []);

  const filteredBills = bills.filter(
    (b) =>
      b.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.phone?.includes(search) ||
      b.invoiceNumber?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDownloadPDF = (bill) => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("Hotel Rajsik", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice No: ${bill.invoiceNumber}`, 20, 35);
    doc.text(`Date: ${bill.date}`, 150, 35);
    doc.text(`Customer: ${bill.name}`, 20, 45);
    doc.text(`Phone: ${bill.phone}`, 150, 45);

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
        Bill History
      </h1>

      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <input
          type="text"
          placeholder="Search by name, phone, or invoice number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 border rounded-lg w-full mb-6 focus:ring-2 focus:ring-rose-400"
        />

        {filteredBills.length === 0 ? (
          <p className="text-center text-gray-500">No bills found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-rose-100 text-rose-700 font-semibold">
                  <th className="py-3 px-4 border">Invoice</th>
                  <th className="py-3 px-4 border">Customer</th>
                  <th className="py-3 px-4 border">Date</th>
                  <th className="py-3 px-4 border">Total</th>
                  <th className="py-3 px-4 border text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBills.map((bill) => (
                  <tr
                    key={bill.id}
                    className="hover:bg-rose-50 transition border-b"
                  >
                    <td className="py-3 px-4 border">{bill.invoiceNumber}</td>
                    <td className="py-3 px-4 border">
                      {bill.name} <br />
                      <span className="text-sm text-gray-500">
                        {bill.phone}
                      </span>
                    </td>
                    <td className="py-3 px-4 border">{bill.date}</td>
                    <td className="py-3 px-4 border font-semibold text-rose-600">
                      ₹{bill.total.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 border text-center">
                      <button
                        onClick={() => handleDownloadPDF(bill)}
                        className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition"
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
