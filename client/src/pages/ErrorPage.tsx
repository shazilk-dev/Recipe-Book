import { useRouteError } from 'react-router'

const ErrorPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const error = useRouteError() as any
  return (
    <div>
      <h1 className="text-2xl font-bold">Oops!</h1>
      <p>{error.statusText || error.message}</p>
    </div>
  )
}

export default ErrorPage
