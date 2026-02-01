import { useAppSelector } from "../redux/hooks/hooks";


export default function Header() {
  const user = useAppSelector((state) => state.auth.user);
  console.log(user)
  return (
    <header className="bg-white  px-8 py-4 flex items-center justify-between h-20 max-h-20">
      <div></div>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-sm font-semibold">👤</span>
        </div>
        <div>
          <p className="font-semibold text-sky-900">{user?.name}</p>
          <p className="text-sm text-gray-500">{user?.role}</p>
        </div>
      </div>
    </header>
  )
}
