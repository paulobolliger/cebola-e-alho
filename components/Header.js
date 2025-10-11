export default function Header() {
  return (
    <header className="bg-purple-600 text-white p-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Cebola & Alho</h1>
      <nav className="space-x-4">
        <a href="/" className="hover:underline">Home</a>
        <a href="/blog" className="hover:underline">Blog</a>
        <a href="/about" className="hover:underline">Sobre</a>
      </nav>
    </header>
  )
}
