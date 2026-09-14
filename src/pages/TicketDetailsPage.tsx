import { ArrowLeft, Send, Trash2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTickets } from '../context/TicketsContext'
import type {
  TicketPriority,
  TicketStatus,
} from '../types/ticket'

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
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function TicketDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const {
    tickets,
    updateTicket,
    deleteTicket,
    addTicketMessage,
  } = useTickets()

  const [message, setMessage] = useState('')

  const ticketId = Number(id)
  const ticket = tickets.find((item) => item.id === ticketId)

  if (!ticket) {
    return (
      <section className="not-found">
        <h1>Заявка не найдена</h1>
        <p>Возможно, она была удалена.</p>

        <button
          className="secondary-button"
          onClick={() => navigate('/tickets')}
          type="button"
        >
          Вернуться к заявкам
        </button>
      </section>
    )
  }

  function handleMessageSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!message.trim()) {
      return
    }

    addTicketMessage(ticketId, message)
    setMessage('')
  }

  function handleDelete() {
    const confirmed = window.confirm(
      `Удалить заявку ${ticket?.code}?`,
    )

    if (!confirmed) {
      return
    }

    deleteTicket(ticketId)
    navigate('/tickets')
  }

  return (
    <>
      <section className="details-heading">
        <div>
          <button
            className="back-button"
            onClick={() => navigate('/tickets')}
            type="button"
          >
            <ArrowLeft size={15} />
            Все заявки
          </button>

          <div className="details-heading__title">
            <span>{ticket.code}</span>
            <h1>{ticket.title}</h1>
          </div>
        </div>

        <button
          className="danger-button"
          onClick={handleDelete}
          type="button"
        >
          <Trash2 size={15} />
          Удалить
        </button>
      </section>

      <div className="ticket-details-grid">
        <div className="ticket-details-main">
          <section className="details-panel">
            <div className="details-panel__header">
              <h2>Описание</h2>

              <div className="details-badges">
                <span className={`badge badge--${ticket.status}`}>
                  {statusLabels[ticket.status]}
                </span>

                <span
                  className={`priority priority--${ticket.priority}`}
                >
                  <span className="priority__dot" />
                  {priorityLabels[ticket.priority]}
                </span>
              </div>
            </div>

            <div className="ticket-description">
              {ticket.description}
            </div>
          </section>

          <section className="details-panel">
            <div className="details-panel__header">
              <div>
                <h2>Комментарии</h2>
                <p>{ticket.messages?.length ?? 0} сообщений</p>
              </div>
            </div>

            <div className="messages-list">
              {(ticket.messages?.length ?? 0) === 0 ? (
                <div className="messages-empty">
                  Комментариев пока нет
                </div>
              ) : (
                ticket.messages?.map((item) => (
                  <article className="message" key={item.id}>
                    <div className="message__avatar">
                      {item.author
                        .split(' ')
                        .map((part) => part[0])
                        .join('')
                        .slice(0, 2)}
                    </div>

                    <div className="message__content">
                      <div className="message__meta">
                        <strong>{item.author}</strong>
                        <span>{formatDate(item.createdAt)}</span>
                      </div>

                      <p>{item.text}</p>
                    </div>
                  </article>
                ))
              )}
            </div>

            <form
              className="message-form"
              onSubmit={handleMessageSubmit}
            >
              <textarea
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Написать комментарий..."
                rows={3}
                value={message}
              />

              <div className="message-form__footer">
                <span>Комментарий сохранится в истории заявки</span>

                <button
                  className="primary-button"
                  disabled={!message.trim()}
                  type="submit"
                >
                  <Send size={14} />
                  Отправить
                </button>
              </div>
            </form>
          </section>
        </div>

        <aside className="ticket-properties">
          <div className="ticket-properties__header">
            Параметры заявки
          </div>

          <label className="property-field">
            <span>Статус</span>

            <select
              onChange={(event) =>
                updateTicket(ticket.id, {
                  status: event.target.value as TicketStatus,
                })
              }
              value={ticket.status}
            >
              <option value="new">Новая</option>
              <option value="in_progress">В работе</option>
              <option value="waiting">Ожидает</option>
              <option value="resolved">Решена</option>
            </select>
          </label>

          <label className="property-field">
            <span>Приоритет</span>

            <select
              onChange={(event) =>
                updateTicket(ticket.id, {
                  priority: event.target.value as TicketPriority,
                })
              }
              value={ticket.priority}
            >
              <option value="low">Низкий</option>
              <option value="medium">Средний</option>
              <option value="high">Высокий</option>
              <option value="urgent">Срочный</option>
            </select>
          </label>

          <label className="property-field">
            <span>Исполнитель</span>

            <select
              onChange={(event) =>
                updateTicket(ticket.id, {
                  assigneeName: event.target.value || null,
                })
              }
              value={ticket.assigneeName ?? ''}
            >
              <option value="">Не назначен</option>
              <option value="Максим Орлов">Максим Орлов</option>
              <option value="Елена Соколова">Елена Соколова</option>
              <option value="Артём Лебедев">Артём Лебедев</option>
            </select>
          </label>

          <div className="property-field">
            <span>Категория</span>
            <strong>{ticket.category}</strong>
          </div>

          <div className="property-divider" />

          <div className="property-field">
            <span>Клиент</span>
            <strong>{ticket.customerName}</strong>
            <small>{ticket.customerEmail}</small>
          </div>

          <div className="property-divider" />

          <div className="property-field">
            <span>Создана</span>
            <strong>{formatDate(ticket.createdAt)}</strong>
          </div>

          <div className="property-field">
            <span>Обновлена</span>
            <strong>{formatDate(ticket.updatedAt)}</strong>
          </div>
        </aside>
      </div>
    </>
  )
}