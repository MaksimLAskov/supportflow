import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { AppLayout } from './layouts/AppLayout'
import { DashboardPage } from './pages/DashboardPage'
import { TicketsPage } from './pages/TicketsPage'
import { TicketsProvider } from './context/TicketsContext'
import { CreateTicketPage } from './pages/CreateTicketPage'
import { TicketDetailsPage } from './pages/TicketDetailsPage'

function PlaceholderPage({ title }: { title: string }) {
  return (
    <section className="placeholder-page">
      <h1>{title}</h1>
      <p>Этот раздел мы добавим следующим этапом.</p>
    </section>
  )
}

function App() {
  return (
    <TicketsProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="tickets" element={<TicketsPage />} />
            <Route path="tickets/new" element={<CreateTicketPage />} />
            <Route path="tickets/:id" element={<TicketDetailsPage />} />
            
            <Route
              path="team"
              element={<PlaceholderPage title="Команда" />}
            />

            <Route
              path="analytics"
              element={<PlaceholderPage title="Аналитика" />}
            />

            <Route
              path="settings"
              element={<PlaceholderPage title="Настройки" />}
            />
          </Route>

          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </BrowserRouter>
    </TicketsProvider>
  )
}

export default App