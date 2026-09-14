import {
  BarChart3,
  Bell,
  LayoutDashboard,
  LifeBuoy,
  Search,
  Settings,
  Ticket,
  Users,
} from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'

const navigation = [
  {
    title: 'Обзор',
    items: [
      {
        label: 'Dashboard',
        path: '/',
        icon: LayoutDashboard,
      },
      {
        label: 'Заявки',
        path: '/tickets',
        icon: Ticket,
      },
    ],
  },
  {
    title: 'Управление',
    items: [
      {
        label: 'Команда',
        path: '/team',
        icon: Users,
      },
      {
        label: 'Аналитика',
        path: '/analytics',
        icon: BarChart3,
      },
    ],
  },
]

export function AppLayout() {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand__mark">
            <LifeBuoy size={24} />
          </div>

          <div>
            <div className="brand__name">SupportFlow</div>
            <div className="brand__caption">Support workspace</div>
          </div>
        </div>

        <nav className="navigation">
          {navigation.map((group) => (
            <div className="navigation__group" key={group.title}>
              <div className="navigation__title">{group.title}</div>

              {group.items.map((item) => {
                const Icon = item.icon

                return (
                  <NavLink
                    className={({ isActive }) =>
                      isActive
                        ? 'navigation__link navigation__link--active'
                        : 'navigation__link'
                    }
                    end={item.path === '/'}
                    key={item.path}
                    to={item.path}
                  >
                    <Icon size={19} />
                    <span>{item.label}</span>
                  </NavLink>
                )
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar__footer">
          <NavLink className="navigation__link" to="/settings">
            <Settings size={19} />
            <span>Настройки</span>
          </NavLink>

          <div className="current-user">
            <div className="current-user__avatar">МО</div>

            <div className="current-user__info">
              <strong>Максим Орлов</strong>
              <span>Support agent</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="header">
          <div className="header__search">
            <Search size={19} />
            <input placeholder="Поиск заявок..." type="search" />
          </div>

          <button
            aria-label="Уведомления"
            className="icon-button"
            type="button"
          >
            <Bell size={20} />
            <span className="notification-dot" />
          </button>
        </header>

        <div className="page">
          <Outlet />
        </div>
      </main>
    </div>
  )
}