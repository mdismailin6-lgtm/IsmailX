import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      await addDoc(collection(db, "messages"), {
        ...formData,
        status: "unread",
        createdAt: serverTimestamp(),
      });
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Failed to send message:", error);
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Contact Me</h2>
      {status === "success" && <p className="text-green-600 text-center">Message sent successfully!</p>}
      {status === "error" && <p className="text-red-600 text-center">Failed to send. Please try again.</p>}
      
      <input required type="text" placeholder="Your Name" className="w-full p-2 border rounded"
        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
      <input required type="email" placeholder="Your Email" className="w-full p-2 border rounded"
        value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
      <input required type="text" placeholder="Subject" className="w-full p-2 border rounded"
        value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
      <textarea required placeholder="Message" rows={4} className="w-full p-2 border rounded"
        value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
      
      <button disabled={status === "submitting"} type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50">
        {status === "submitting" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
