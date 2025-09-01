import {
  AtSignIcon,
  EarthIcon,
  FacebookIcon,
  LinkedinIcon,
  TwitterIcon,
} from 'lucide-react'

const socialLinks = [
  {
    name: 'LinkedIn',
    link: '/',
    icon: <LinkedinIcon />,
  },
  {
    name: 'X',
    link: '/',
    icon: <TwitterIcon />,
  },
  {
    name: 'Facebook',
    link: '/',
    icon: <FacebookIcon />,
  },
  {
    name: 'Website',
    link: '/',
    icon: <EarthIcon />,
  },
]

const description =
  'Kind kitchen is your go-to site for discovering, saving, and sharing delicious recipes from around the world. Explore new dishes, organize your favorites, and get inspired to cook every day!'

const Footer = () => {
  return (
    <footer className="relative z-40 bg-[#191F33]">
      <div className="flex flex-col items-center px-4 py-12">
        {/* app logo */}
        <div>
          <a
            href="/"
            className="mb-8 flex items-center justify-center gap-5 text-white"
          >
            <img src="/recipe-logo.png" className="h-32" alt="Logo" />
            {/* <span className="text-3xl font-semibold tracking-wider">
              Kind kitchen
            </span> */}
          </a>
          <p className="max-w-xl text-center text-lg font-medium text-white">
            {description}
          </p>
        </div>

        {/* social links */}
        <div className="mt-8">
          <span className="mb-6 block text-center text-lg font-medium text-[#767E94]">
            Follow Us
          </span>
          <ul className="flex items-center gap-6">
            {socialLinks.map(({ name, icon, link }) => (
              <li key={name}>
                <a
                  href={link}
                  title={name}
                  className="text-white hover:text-[#767e94]"
                  target="_blank"
                >
                  {icon}
                </a>
                <span className="sr-only">{name} account</span>
              </li>
            ))}
          </ul>
        </div>

        {/* email */}
        <div className="mt-6 mb-2 flex items-center gap-2 text-white">
          <AtSignIcon size={16} />
          <span className="text-lg font-medium">info@email.com</span>
        </div>
      </div>

      {/* about author or app/copyrights */}
      <div className="bg-[#2E3447]">
        <div className="px-3 py-3 text-center">
          <span className="text-[#767E94]">
            Coded with 💙 by{' '}
            <a
              href="https://www.linkedin.com/in/shazilkhan-dev/"
              target="_blank"
              className="text-white"
            >
              Shazil Khan{' '}
            </a>
            in Karachi
          </span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
