import { MenuIcon, XIcon } from 'lucide-react'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '../app/store'
import { logout } from '../features/auth/authSlice'
import { Link, NavLink } from 'react-router'

const navLinks = [
  { title: 'Home', link: '/' },
  { title: 'About', link: '/about' },
]

const Navbar = () => {
  const [showNav, setShowNav] = useState(false)
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated)
  const dispatch = useDispatch<AppDispatch>()

  return (
    <nav className="relative z-20 border-b border-orange-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 sm:gap-8">
          {/* mobile menu toggle */}
          <button
            onClick={() => setShowNav(!showNav)}
            aria-label="Toggle Menu"
            className="md:hidden"
          >
            {showNav ? (
              <XIcon color="#202020" strokeWidth={3} size={25} />
            ) : (
              <MenuIcon color="#202020" strokeWidth={3} size={25} />
            )}
          </button>
          {/* logo only */}
          <a href="/" className="flex items-center" aria-label="Home">
            <img
              src="/recipe-logo.png"
              alt="Logo"
              className="h-18 w-18 object-contain select-none"
              draggable={false}
            />
          </a>
          {/* nav links */}
          <div
            className={`absolute right-0 left-0 -z-10 flex w-full flex-col gap-3 bg-white p-3 shadow transition-all duration-300 ease-in-out md:relative md:top-auto md:right-auto md:left-0 md:z-auto md:flex-row md:shadow-none ${
              showNav ? 'top-[54px]' : 'top-[-165px]'
            }`}
          >
            {navLinks.map(({ title, link }) => (
              <NavLink
                key={link}
                to={link}
                className={({ isActive }: { isActive: boolean }) =>
                  `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-orange-500 text-white'
                      : 'text-slate-600 hover:bg-orange-100 hover:text-slate-900'
                  }`
                }
              >
                {title}
              </NavLink>
            ))}
          </div>
        </div>
        {/* auth buttons */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <button
              onClick={() => dispatch(logout())}
              className="rounded-md border border-red-200 bg-red-50 px-3 py-1 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
            >
              Logout
            </button>
          ) : (
            <Link
              to="login"
              className="rounded-md border border-orange-300 bg-orange-500 px-4 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-orange-600"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
