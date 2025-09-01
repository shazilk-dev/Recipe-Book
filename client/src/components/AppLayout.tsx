import { Outlet } from 'react-router'
import Footer from './Footer'
import Navbar from './Navbar'

const AppLayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}

export default AppLayout
