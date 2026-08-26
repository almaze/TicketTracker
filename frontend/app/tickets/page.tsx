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
            }
        }

        loadTickets();
    }, [router]);

    return (
        <main>
            <h1>My Tickets</h1>

            

            {error && <p>{error}</p>}

            {tickets.length === 0 && !error && (
                <p>No tickets found.</p>
            )}

            {tickets.map((ticket) => (
                <div key={ticket.id}>
                    <h2>{ticket.title}</h2>
                    <p>{ticket.description}</p>
                    <p>Priority: {ticket.priority}</p>
                    <p>Status: {ticket.status}</p>
                </div>
            ))}
            
            <button onClick={handleLogout}>Logout</button>
            
        </main>
    );
}