"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AuthGuard from "@/components/auth-guard";
import { api } from "@/lib/api";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function OrganizerEventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);

  // Add ticket states
  const [openAdd, setOpenAdd] = useState(false);
  const [newTicket, setNewTicket] = useState({
    name: "",
    price: "",
    stock: "",
  });

  // Edit ticket states
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    id: "",
    name: "",
    price: "",
    stock: "",
  });

  async function fetchEvent() {
    try {
      const res = await api.get(`/events/${id}`);
      setEvent(res.data.data);
    } catch (err) {
      console.error("Event fetch error:", err);
    }
  }

  useEffect(() => {
    fetchEvent();
  }, []);

  function handleAddChange(e: any) {
    const { name, value } = e.target;
    setNewTicket({ ...newTicket, [name]: value });
  }

  async function handleAddTicket() {
    try {
      await api.post(`/events/${id}/tickets`, {
        name: newTicket.name,
        price: Number(newTicket.price),
        stock: Number(newTicket.stock),
      });

      setOpenAdd(false);
      setNewTicket({ name: "", price: "", stock: "" });
      fetchEvent();
    } catch (err) {
      console.error("Add failed:", err);
      alert("Failed to add ticket");
    }
  }

  function handleOpenEdit(ticket: any) {
    setEditForm({
      id: ticket.id,
      name: ticket.name,
      price: ticket.price.toString(),
      stock: ticket.stock.toString(),
    });
    setEditOpen(true);
  }

  function handleEditChange(e: any) {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  }

  async function handleSaveEdit() {
    try {
      await api.put(`/events/tickets/${editForm.id}`, {
        name: editForm.name,
        price: Number(editForm.price),
        stock: Number(editForm.stock),
      });
      setEditOpen(false);
      fetchEvent();
    } catch (err) {
      console.error("Edit failed:", err);
      alert("Failed to edit ticket");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this ticket?")) return;
    try {
      await api.delete(`/events/tickets/${id}`);
      fetchEvent();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete");
    }
  }

  if (!event)
    return (
      <AuthGuard roles={["ORGANIZER"]}>
        <p className="text-white p-6">Loading...</p>
      </AuthGuard>
    );

  return (
    <AuthGuard roles={["ORGANIZER"]}>
      <main className="min-h-screen px-6 py-10 space-y-6">
        <h1 className="text-3xl font-semibold text-white">
          Manage Event: {event.title}
        </h1>

        {/* Ticket List */}
        <div className="space-y-3">
          {event.ticketTypes?.map((ticket: any) => (
            <div
              key={ticket.id}
              className="bg-zinc-900 p-4 rounded border border-zinc-700 flex justify-between"
            >
              <div>
                <p className="text-white font-semibold">{ticket.name}</p>
                <p className="text-gray-300 text-sm">
                  Stock: {ticket.stock} — Price: Rp {ticket.price.toLocaleString()}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  className="bg-blue-600 px-3 py-1 rounded text-white text-sm"
                  onClick={() => handleOpenEdit(ticket)}
                >
                  Edit
                </button>

                <button
                  className="bg-red-600 px-3 py-1 rounded text-white text-sm"
                  onClick={() => handleDelete(ticket.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          className="bg-turquoise text-black px-4 py-2 rounded"
          onClick={() => setOpenAdd(true)}
        >
          Add Ticket Type
        </button>
      </main>

      {/* ADD MODAL */}
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="bg-zinc-900 border border-zinc-700 text-white">
          <DialogHeader>
            <DialogTitle>Add Ticket</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <input
              name="name"
              placeholder="Name"
              className="bg-zinc-800 p-2 rounded w-full"
              onChange={handleAddChange}
            />

            <input
              type="number"
              name="price"
              placeholder="Price"
              className="bg-zinc-800 p-2 rounded w-full"
              onChange={handleAddChange}
            />

            <input
              type="number"
              name="stock"
              placeholder="Stock"
              className="bg-zinc-800 p-2 rounded w-full"
              onChange={handleAddChange}
            />
          </div>

          <DialogFooter>
            <button
              className="bg-green-600 px-4 py-2 rounded text-white w-full"
              onClick={handleAddTicket}
            >
              Save
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT MODAL */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="bg-zinc-900 border border-zinc-700 text-white">
          <DialogHeader>
            <DialogTitle>Edit Ticket</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <input
              name="name"
              value={editForm.name}
              onChange={handleEditChange}
              className="bg-zinc-800 p-2 rounded w-full"
            />

            <input
              type="number"
              name="price"
              value={editForm.price}
              onChange={handleEditChange}
              className="bg-zinc-800 p-2 rounded w-full"
            />

            <input
              type="number"
              name="stock"
              value={editForm.stock}
              onChange={handleEditChange}
              className="bg-zinc-800 p-2 rounded w-full"
            />
          </div>

          <DialogFooter>
            <button
              className="bg-green-600 px-4 py-2 rounded text-white w-full"
              onClick={handleSaveEdit}
            >
              Save Changes
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthGuard>
  );
}
