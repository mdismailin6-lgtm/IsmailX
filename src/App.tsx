import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import CategoryProjects from "./pages/CategoryProjects";
import ProjectDetail from "./pages/ProjectDetail";
import ContactForm from "./components/ContactForm";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <header className="bg-white shadow p-4 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">IsmailX</Link>
            <nav className="space-x-4">
              <Link to="/" className="hover:text-blue-600">Home</Link>
              <a href="#contact" className="hover:text-blue-600">Contact</a>
            </nav>
          </div>
        </header>

        <main className="py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:slug" element={<CategoryProjects />} />
            <Route path="/project/:slug" element={<ProjectDetail />} />
          </Routes>
          
          <section id="contact" className="py-12 bg-gray-100">
            <ContactForm />
          </section>
        </main>

        <footer className="bg-gray-800 text-white text-center p-6">
          <p>&copy; {new Date().getFullYear()} IsmailX. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
