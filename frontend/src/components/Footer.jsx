import { Link } from 'react-router-dom'
import { GraduationCap, Github, Twitter, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-2">
              <GraduationCap className="h-6 w-6 text-primary-400" />
              CampusEvents
            </div>
            <p className="text-sm">Your central hub for discovering and managing campus events.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-1.5 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/events" className="hover:text-white transition-colors">Browse Events</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Sign Up</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <div className="flex gap-3">
              <a href="mailto:events@campus.edu" className="hover:text-white transition-colors"><Mail className="h-5 w-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Github className="h-5 w-5" /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs">
          © {new Date().getFullYear()} CampusEvents. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
