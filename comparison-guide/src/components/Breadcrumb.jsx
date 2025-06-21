import Link from 'next/link';

export default function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-500">
      <Link href="/" className="hover:text-gray-700 transition-colors">
        Home
      </Link>
      {items.map((item, index) => (
        <span key={index} className="flex items-center space-x-1">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          {item.href ? (
            <Link href={item.href} className="hover:text-gray-700 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}