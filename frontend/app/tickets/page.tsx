"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Ticket = {
    id: number;
    title: string;
    description: string | null;
    priority: string;
    status: string;
};

export default function TicketsPage() {
    const router = useRouter();

    function handleLogout() {
        localStorage.removeItem("token");
        router.push("/login");
    }   

    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [error, setError] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("Low");
    const [status, setStatus] = useState("Open");
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState("");
    const [updatingTicketId, setUpdatingTicketId] = useState<number | null>(null);
    const [updateError, setUpdateError] = useState("");
    const [loading, setLoading] = useState(true);
     async function handleCreateTicket(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setCreateError("");

        if (!title.trim()) {
            setCreateError("Title is required.");
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/login");
            return;
        }

        setCreating(true);

        try {
            const response = await fetch(
                "http://localhost:5087/api/tickets",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        title,
                        description,
                        priority,
                        status,
                    }),
                }
            );

            if (response.status === 401) {
                localStorage.removeItem("token");
                router.push("/login");
                return;
            }

            const data = await response.json();

            if (!response.ok) {
                setCreateError(
                    data.message || "Failed to create ticket."
                );
                return;
            }

            setTickets((currentTickets) => [
                ...currentTickets,
                data,
            ]);

            setTitle("");
            setDescription("");
            setPriority("Low");
            setStatus("Open");
        } catch {
            setCreateError("Unable to connect to the API.");
        } finally {
            setCreating(false);
        }
    }

    async function handleStatusChange(
        ticket: Ticket,
        newStatus: string
    ) {
        setUpdateError("");

        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/login");
            return;
        }

        setUpdatingTicketId(ticket.id);

        try {
            const response = await fetch(
                `http://localhost:5087/api/tickets/${ticket.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        title: ticket.title,
                        description: ticket.description,
                        priority: ticket.priority,
                        status: newStatus,
                    }),
                }
            );

            if (response.status === 401) {
                localStorage.removeItem("token");
                router.push("/login");
                return;
            }

            const data = await response.json();

            if (!response.ok) {
                setUpdateError(
                    data.message || "Failed to update ticket."
                );
                return;
            }

            setTickets((currentTickets) =>
                currentTickets.map((currentTicket) =>
                    currentTicket.id === ticket.id
                        ? data
                        : currentTicket
                )
            );
        } catch {
            setUpdateError("Unable to connect to the API.");
        } finally {
            setUpdatingTicketId(null);
      }
    }
    useEffect(() => {
        async function loadTickets() {
            const token = localStorage.getItem("token");

            if (!token) {
                router.push("/login");
                return;
            }

            try {
                const response = await fetch(
                    "http://localhost:5087/api/tickets",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.status === 401) {
                    localStorage.removeItem("token");
                    router.push("/login");
                    return;
                }

                if (!response.ok) {
                    setError("Failed to load tickets.");
                    return;
                }

                const data = await response.json();

                setTickets(data);
            } catch {
                setError("Unable to connect to the API.");
            } finally {
                setLoading(false);
            }
        }

        loadTickets();
    }, [router]);

    return (
        <main className="tickets-container">
            <h1>My Tickets</h1>

            

            {error && <p>{error}</p>}

            <h2>Create Ticket</h2>

            <form onSubmit={handleCreateTicket} className="ticket-form">
                <div className="form-field">
                    <label htmlFor="title">Title</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="priority">Priority</label>
                    <select
                        id="priority"
                        value={priority}
                        onChange={(event) => setPriority(event.target.value)}
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>

                <div className="form-field">
                    <label htmlFor="status">Status</label>
                    <select
                        id="status"
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                    >
                        <option value="Open">Open</option>
                        <option value="InProgress">InProgress</option>
                        <option value="Closed">Closed</option>
                    </select>
                </div>

                {createError && (
                    <p className="create-error">{createError}</p>
                )}

                <button type="submit" disabled={creating}>
                    {creating ? "Creating..." : "Create Ticket"}
                </button>
            </form>

            {loading && <p>Loading tickets...</p>}

            {!loading && tickets.length === 0 && !error && (
                <p>No tickets found.</p>
            )}

            {tickets.map((ticket) => (
                <div key={ticket.id} className="ticket-card">
                    <h2>{ticket.title}</h2>

                    <p>{ticket.description}</p>

                    <p>
                        Priority: {ticket.priority}
                    </p>

                    <p>
                        Status: {ticket.status}
                    </p>

                    <div className="form-field">
                        <label htmlFor={`status-${ticket.id}`}>
                            Change Status
                        </label>

                        <select
                            id={`status-${ticket.id}`}
                            value={ticket.status}
                            disabled={updatingTicketId === ticket.id}
                            onChange={(event) =>
                                handleStatusChange(
                                    ticket,
                                    event.target.value
                                )
                            }
                        >
                            <option value="Open">Open</option>
                            <option value="InProgress">InProgress</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>

                    {updatingTicketId === ticket.id && (
                        <p>Updating...</p>
                    )}
                </div>
            ))}

            <button onClick={handleLogout} className="logout-button">
                Logout
            </button>
            
        </main>
    );
}