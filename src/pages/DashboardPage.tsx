import { ArrowUpRight, Clock3, Plus, TicketCheck, Tickets } from 'lucide-react'
import type { TicketPriority, TicketStatus } from '../types/ticket'
import { useTickets } from '../context/TicketsContext'
import { useNavigate } from 'react-router-dom'

const statusLabels: Record<TicketStatus, string> = {
  new: 'Новая',
  in_progress: 'В работе',
  waiting: 'Ожидает',
  resolved: 'Решена',
}

const priorityLabels: Record<TicketPriority, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
  urgent: 'Срочный',
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function DashboardPage() {
  const navigate = useNavigate()
  const { tickets } = useTickets()
  const newTickets = tickets.filter(
    (ticket) => ticket.status === 'new',
  ).length

  const activeTickets = tickets.filter(
    (ticket) => ticket.status === 'in_progress',
  ).length

  const waitingTickets = tickets.filter(
    (ticket) => ticket.status === 'waiting',
  ).length

  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status === 'resolved',
  ).length

  const statistics = [
    {
      label: 'Новые заявки',
      value: newTickets,
      caption: 'Требуют назначения',
      icon: Tickets,
      color: 'blue',
    },
    {
      label: 'В работе',
      value: activeTickets,
      caption: 'Обрабатываются командой',
      icon: Clock3,
      color: 'orange',
    },
    {
      label: 'Ожидают ответа',
      value: waitingTickets,
      caption: 'Нужен ответ клиента',
      icon: ArrowUpRight,
      color: 'purple',
    },
    {
      label: 'Решено',
      value: resolvedTickets,
      caption: 'За всё время',
      icon: TicketCheck,
      color: 'green',
    },
  ]

  return (
    <>
      <section className="page-heading">
        <div>
            <h1>Обзор</h1>

            <p className="page-heading__description">
            Заявки и активность команды за сегодня
            </p>
        </div>

        <button
            className="primary-button"
            onClick={() => navigate('/tickets/new')}
            type="button"
        >
            <Plus size={16} />
            Новая заявка
        </button>
</section>

      <section className="statistics-grid">
        {statistics.map((item) => {
          const Icon = item.icon

          return (
            <article className="stat-card" key={item.label}>
              <div className={`stat-card__icon stat-card__icon--${item.color}`}>
                <Icon size={21} />
              </div>

              <div className="stat-card__value">{item.value}</div>
              <div className="stat-card__label">{item.label}</div>
              <div className="stat-card__caption">{item.caption}</div>
            </article>
          )
        })}
      </section>

      <section className="panel">
        <div className="panel__header">
          <div>
            <h2>Последние заявки</h2>
            <p>Недавно созданные и обновлённые обращения</p>
          </div>

          <button className="secondary-button" type="button">
            Все заявки
          </button>
        </div>

        <div className="table-wrapper">
          <table className="tickets-table">
            <thead>
              <tr>
                <th>Заявка</th>
                <th>Клиент</th>
                <th>Статус</th>
                <th>Приоритет</th>
                <th>Исполнитель</th>
                <th>Обновлена</th>
              </tr>
            </thead>

            <tbody>
              {tickets.slice(0, 5).map((ticket) => (
                <tr key={ticket.id}>
                  <td>
                    <span className="ticket-code">{ticket.code}</span>
                    <strong className="ticket-title">{ticket.title}</strong>
                  </td>

                  <td>
                    <strong>{ticket.customerName}</strong>
                    <span className="table-secondary">
                      {ticket.customerEmail}
                    </span>
                  </td>

                  <td>
                    <span className={`badge badge--${ticket.status}`}>
                      {statusLabels[ticket.status]}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`priority priority--${ticket.priority}`}
                    >
                      <span className="priority__dot" />
                      {priorityLabels[ticket.priority]}
                    </span>
                  </td>

                  <td>{ticket.assigneeName ?? 'Не назначен'}</td>
                  <td>{formatDate(ticket.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}