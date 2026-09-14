import { Plus, RotateCcw, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { TicketPriority, TicketStatus } from '../types/ticket'
import { useTickets } from '../context/TicketsContext'
import { useNavigate } from 'react-router-dom'

type SortOption = 'newest' | 'oldest' | 'priority'

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

const priorityWeight: Record<TicketPriority, number> = {
  low: 1,
  medium: 2,
  high: 3,
  urgent: 4,
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function TicketsPage() {
  const navigate = useNavigate()
  const { tickets } = useTickets()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<TicketStatus | 'all'>('all')
  const [priority, setPriority] =
    useState<TicketPriority | 'all'>('all')
  const [sort, setSort] = useState<SortOption>('newest')

  const filteredTickets = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    const result = tickets.filter((ticket) => {
      const matchesSearch =
        ticket.title.toLowerCase().includes(normalizedSearch) ||
        ticket.code.toLowerCase().includes(normalizedSearch) ||
        ticket.customerName.toLowerCase().includes(normalizedSearch) ||
        ticket.customerEmail.toLowerCase().includes(normalizedSearch)

      const matchesStatus =
        status === 'all' || ticket.status === status

      const matchesPriority =
        priority === 'all' || ticket.priority === priority

      return matchesSearch && matchesStatus && matchesPriority
    })

    return [...result].sort((firstTicket, secondTicket) => {
      if (sort === 'oldest') {
        return (
          new Date(firstTicket.createdAt).getTime() -
          new Date(secondTicket.createdAt).getTime()
        )
      }

      if (sort === 'priority') {
        return (
          priorityWeight[secondTicket.priority] -
          priorityWeight[firstTicket.priority]
        )
      }

      return (
        new Date(secondTicket.createdAt).getTime() -
        new Date(firstTicket.createdAt).getTime()
      )
    })
  }, [tickets, search, status, priority, sort])

  const hasActiveFilters =
    search !== '' || status !== 'all' || priority !== 'all'

  function resetFilters() {
    setSearch('')
    setStatus('all')
    setPriority('all')
  }

  return (
    <>
      <section className="page-heading">
        <div>
          <h1>Заявки</h1>

          <p className="page-heading__description">
            Управление обращениями клиентов
          </p>
        </div>

        <button className="primary-button"
        onClick={() => navigate('/tickets/new')}
        type="button">
          <Plus size={16} />
          Новая заявка
        </button>
        
      </section>

      <section className="tickets-panel">
        <div className="tickets-toolbar">
          <label className="toolbar-search">
            <Search size={15} />

            <input
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Номер, тема или клиент"
              type="search"
              value={search}
            />
          </label>

          <div className="toolbar-filters">
            <select
              aria-label="Фильтр по статусу"
              onChange={(event) =>
                setStatus(event.target.value as TicketStatus | 'all')
              }
              value={status}
            >
              <option value="all">Все статусы</option>
              <option value="new">Новые</option>
              <option value="in_progress">В работе</option>
              <option value="waiting">Ожидают</option>
              <option value="resolved">Решённые</option>
            </select>

            <select
              aria-label="Фильтр по приоритету"
              onChange={(event) =>
                setPriority(event.target.value as TicketPriority | 'all')
              }
              value={priority}
            >
              <option value="all">Любой приоритет</option>
              <option value="urgent">Срочный</option>
              <option value="high">Высокий</option>
              <option value="medium">Средний</option>
              <option value="low">Низкий</option>
            </select>

            <select
              aria-label="Сортировка"
              onChange={(event) =>
                setSort(event.target.value as SortOption)
              }
              value={sort}
            >
              <option value="newest">Сначала новые</option>
              <option value="oldest">Сначала старые</option>
              <option value="priority">По приоритету</option>
            </select>

            {hasActiveFilters && (
              <button
                className="reset-button"
                onClick={resetFilters}
                type="button"
              >
                <RotateCcw size={14} />
                Сбросить
              </button>
            )}
          </div>
        </div>

        <div className="tickets-result-bar">
          <span>
            Найдено заявок: <strong>{filteredTickets.length}</strong>
          </span>

          <span>Всего: {tickets.length}</span>
        </div>

        {filteredTickets.length > 0 ? (
          <div className="table-wrapper">
            <table className="tickets-table tickets-table--full">
              <thead>
                <tr>
                  <th>Заявка</th>
                  <th>Клиент</th>
                  <th>Категория</th>
                  <th>Статус</th>
                  <th>Приоритет</th>
                  <th>Исполнитель</th>
                  <th>Создана</th>
                </tr>
              </thead>

              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr
                    className="clickable-row"
                    key={ticket.id}
                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                  >
                    <td>
                      <span className="ticket-code">{ticket.code}</span>

                      <strong className="ticket-title">
                        {ticket.title}
                      </strong>
                    </td>

                    <td>
                      <strong>{ticket.customerName}</strong>

                      <span className="table-secondary">
                        {ticket.customerEmail}
                      </span>
                    </td>

                    <td>{ticket.category}</td>

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
                    <td>{formatDate(ticket.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <strong>Заявки не найдены</strong>

            <p>
              Попробуйте изменить поисковый запрос или сбросить фильтры.
            </p>

            <button
              className="secondary-button"
              onClick={resetFilters}
              type="button"
            >
              Сбросить фильтры
            </button>
          </div>
        )}
      </section>
    </>
  )
}