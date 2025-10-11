export default function BlogCard({ title, excerpt, image }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition cursor-pointer">
      {image && (
        <img
          src={image}
          alt={title}
          className="w-full h-40 object-cover"
        />
      )}
      <div className="p-4 bg-white">
        <h2 className="font-bold text-xl text-purple-700 mb-2">{title}</h2>
        <p className="text-gray-700 text-sm mb-2">{excerpt}</p>
        <span className="text-blue-600 font-semibold">Leia mais →</span>
      </div>
    </div>
  )
}
