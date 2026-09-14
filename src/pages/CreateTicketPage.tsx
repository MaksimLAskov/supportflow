import { ArrowLeft } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTickets } from '../context/TicketsContext'
import type { TicketPriority } from '../types/ticket'

interface FormValues {
  title: string
  description: string
  category: string
  priority: TicketPriority
  customerName: string
  customerEmail: string
}

type FormErrors = Partial<Record<keyof FormValues, string>>

const initialValues: FormValues = {
  title: '',
  description: '',
  category: '',
  priority: 'medium',
  customerName: '',
  customerEmail: '',
}

export function CreateTicketPage() {
  const navigate = useNavigate()
  const { createTicket } = useTickets()

  const [form, setForm] = useState<FormValues>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})

  function updateField<Key extends keyof FormValues>(
    field: Key,
    value: FormValues[Key],
  ) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }))

    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }))
  }

  function validateForm() {
    const newErrors: FormErrors = {}

    if (form.title.trim().length < 5) {
      newErrors.title = 'Укажите тему длиной не менее 5 символов'
    }

    if (form.description.trim().length < 15) {
      newErrors.description =
        'Опишите проблему хотя бы в 15 символах'
    }

    if (!form.category) {
      newErrors.category = 'Выберите категорию'
    }

    if (form.customerName.trim().length < 2) {
      newErrors.customerName = 'Укажите имя клиента'
    }

    if (!form.customerEmail.trim()) {
      newErrors.customerEmail = 'Укажите email клиента'
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail)
    ) {
      newErrors.customerEmail = 'Введите корректный email'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault()

  if (!validateForm()) {
    return
  }

  const newTicketId = createTicket({
    title: form.title.trim(),
    description: form.description.trim(),
    category: form.category,
    priority: form.priority,
    customerName: form.customerName.trim(),
    customerEmail: form.customerEmail.trim().toLowerCase(),
  })

  navigate(`/tickets/${newTicketId}`)
}

  return (
    <>
      <section className="page-heading">
        <div>
          <button
            className="back-button"
            onClick={() => navigate(-1)}
            type="button"
          >
            <ArrowLeft size={15} />
            Назад к заявкам
          </button>

          <h1>Новая заявка</h1>

          <p className="page-heading__description">
            Зарегистрируйте новое обращение клиента
          </p>
        </div>
      </section>

      <form className="ticket-form" onSubmit={handleSubmit}>
        <section className="form-section">
          <div className="form-section__heading">
            <h2>Обращение</h2>
            <p>Основная информация о проблеме</p>
          </div>

          <div className="form-fields">
            <label className="form-field form-field--full">
              <span>Тема обращения</span>

              <input
                className={errors.title ? 'field-error' : ''}
                onChange={(event) =>
                  updateField('title', event.target.value)
                }
                placeholder="Например: не проходит оплата"
                value={form.title}
              />

              {errors.title && (
                <small className="error-message">{errors.title}</small>
              )}
            </label>

            <label className="form-field">
              <span>Категория</span>

              <select
                className={errors.category ? 'field-error' : ''}
                onChange={(event) =>
                  updateField('category', event.target.value)
                }
                value={form.category}
              >
                <option value="">Выберите категорию</option>
                <option value="Аккаунт">Аккаунт</option>
                <option value="Оплата">Оплата</option>
                <option value="Доставка">Доставка</option>
                <option value="Возврат">Возврат</option>
                <option value="Техническая проблема">
                  Техническая проблема
                </option>
                <option value="Другое">Другое</option>
              </select>

              {errors.category && (
                <small className="error-message">
                  {errors.category}
                </small>
              )}
            </label>

            <label className="form-field">
              <span>Приоритет</span>

              <select
                onChange={(event) =>
                  updateField(
                    'priority',
                    event.target.value as TicketPriority,
                  )
                }
                value={form.priority}
              >
                <option value="low">Низкий</option>
                <option value="medium">Средний</option>
                <option value="high">Высокий</option>
                <option value="urgent">Срочный</option>
              </select>
            </label>

            <label className="form-field form-field--full">
              <span>Описание проблемы</span>

              <textarea
                className={errors.description ? 'field-error' : ''}
                onChange={(event) =>
                  updateField('description', event.target.value)
                }
                placeholder="Что произошло и какой результат ожидал клиент?"
                rows={6}
                value={form.description}
              />

              <div className="field-footer">
                {errors.description ? (
                  <small className="error-message">
                    {errors.description}
                  </small>
                ) : (
                  <small>Минимум 15 символов</small>
                )}

                <small>{form.description.length} символов</small>
              </div>
            </label>
          </div>
        </section>

        <section className="form-section">
          <div className="form-section__heading">
            <h2>Клиент</h2>
            <p>Контактные данные автора обращения</p>
          </div>

          <div className="form-fields">
            <label className="form-field">
              <span>Имя клиента</span>

              <input
                className={errors.customerName ? 'field-error' : ''}
                onChange={(event) =>
                  updateField('customerName', event.target.value)
                }
                placeholder="Иван Петров"
                value={form.customerName}
              />

              {errors.customerName && (
                <small className="error-message">
                  {errors.customerName}
                </small>
              )}
            </label>

            <label className="form-field">
              <span>Email</span>

              <input
                className={errors.customerEmail ? 'field-error' : ''}
                onChange={(event) =>
                  updateField('customerEmail', event.target.value)
                }
                placeholder="client@example.com"
                type="email"
                value={form.customerEmail}
              />

              {errors.customerEmail && (
                <small className="error-message">
                  {errors.customerEmail}
                </small>
              )}
            </label>
          </div>
        </section>

        <div className="form-actions">
          <button
            className="secondary-button"
            onClick={() => navigate(-1)}
            type="button"
          >
            Отмена
          </button>

          <button className="primary-button" type="submit">
            Создать заявку
          </button>
        </div>
      </form>
    </>
  )
}