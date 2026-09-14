import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react'
import { mockTickets } from '../data/mockTickets'
import type {
  Ticket,
  TicketMessage,
  TicketPriority,
} from '../types/ticket'

interface CreateTicketData {
  title: string
  description: string
  priority: TicketPriority
  category: string
  customerName: string
  customerEmail: string
}

interface TicketsContextValue {
  tickets: Ticket[]
  createTicket: (data: CreateTicketData) => number
  updateTicket: (id: number, changes: Partial<Ticket>) => void
  deleteTicket: (id: number) => void
  addTicketMessage: (ticketId: number, text: string) => void
  resetTickets: () => void
}

const STORAGE_KEY = 'supportflow_tickets'

const TicketsContext = createContext<TicketsContextValue | null>(null)

function getSavedTickets(): Ticket[] {
  const savedTickets = localStorage.getItem(STORAGE_KEY)

  if (!savedTickets) {
    return mockTickets
  }

  try {
    return JSON.parse(savedTickets) as Ticket[]
  } catch {
    return mockTickets
  }
}

export function TicketsProvider({ children }: PropsWithChildren) {
  const [tickets, setTickets] = useState<Ticket[]>(getSavedTickets)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets))
  }, [tickets])

  function createTicket(data: CreateTicketData) {
    const nextId =
      Math.max(0, ...tickets.map((ticket) => ticket.id)) + 1

    const highestCodeNumber = Math.max(
      1000,
      ...tickets.map((ticket) =>
        Number(ticket.code.replace('SUP-', '')),
      ),
    )

    const currentDate = new Date().toISOString()

    const newTicket: Ticket = {
      id: nextId,
      code: `SUP-${highestCodeNumber + 1}`,
      title: data.title,
      description: data.description,
      status: 'new',
      priority: data.priority,
      category: data.category,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      assigneeName: null,
      createdAt: currentDate,
      updatedAt: currentDate,
      messages: [],
    }

    setTickets((currentTickets) => [
      newTicket,
      ...currentTickets,
    ])

    return nextId
  }

  function updateTicket(id: number, changes: Partial<Ticket>) {
    setTickets((currentTickets) =>
      currentTickets.map((ticket) =>
        ticket.id === id
          ? {
              ...ticket,
              ...changes,
              updatedAt: new Date().toISOString(),
            }
          : ticket,
      ),
    )
  }

  function deleteTicket(id: number) {
    setTickets((currentTickets) =>
      currentTickets.filter((ticket) => ticket.id !== id),
    )
  }

  function addTicketMessage(ticketId: number, text: string) {
    const newMessage: TicketMessage = {
      id: Date.now(),
      author: 'Максим Орлов',
      role: 'support',
      text: text.trim(),
      createdAt: new Date().toISOString(),
    }

    setTickets((currentTickets) =>
      currentTickets.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              messages: [...(ticket.messages ?? []), newMessage],
              updatedAt: new Date().toISOString(),
            }
          : ticket,
      ),
    )
  }

  function resetTickets() {
    setTickets(mockTickets)
  }

  return (
    <TicketsContext.Provider
      value={{
        tickets,
        createTicket,
        updateTicket,
        deleteTicket,
        addTicketMessage,
        resetTickets,
      }}
    >
      {children}
    </TicketsContext.Provider>
  )
}


// eslint-disable-next-line react-refresh/only-export-components
export function useTickets() {
  const context = useContext(TicketsContext)

  if (!context) {
    throw new Error(
      'useTickets должен использоваться внутри TicketsProvider',
    )
  }

  return context
}