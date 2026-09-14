export type TicketStatus =
  | 'new'
  | 'in_progress'
  | 'waiting'
  | 'resolved'

export type TicketPriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'urgent'

export interface TicketMessage {
  id: number
  author: string
  role: 'customer' | 'support'
  text: string
  createdAt: string
}

export interface Ticket {
  id: number
  code: string
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  category: string
  customerName: string
  customerEmail: string
  assigneeName: string | null
  createdAt: string
  updatedAt: string
  messages?: TicketMessage[]
}