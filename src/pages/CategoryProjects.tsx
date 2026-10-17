import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Category, Project } from "../types";

export default function CategoryProjects() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catQuery = query(collection(db, "categories"), where("slug", "==", slug));
        const catSnap = await getDocs(catQuery);
        if (!catSnap.empty) {
          const catDoc = catSnap.docs[0];
          setCategory({ id: catDoc.id, ...catDoc.data() } as Category);

          const projQuery = query(
            collection(db, "projects"), 
            where("isVisible", "==", true), 
            where("categoryIds", "array-contains", catDoc.id)
          );
          const projSnap = await getDocs(projQuery);
          setProjects(projSnap.docs.map(d => ({ id: d.id, ...d.data() } as Project)));
        }
      } catch (error) {
        console.error("Error fetching category data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!category) return <div className="p-8 text-center">Category not found.</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
      <p className="text-gray-600 mb-8">{category.description}</p>
      
      <div className="grid md:grid-cols-3 gap-6">
        {projects.length > 0 ? projects.map(proj => (
          <Link key={proj.id} to={`/project/${proj.slug}`} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-xl transition">
            {proj.thumbnailUrl && <img src={proj.thumbnailUrl} alt={proj.name} className="w-full h-48 object-cover" />}
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">{proj.name}</h3>
              <p className="text-gray-600 text-sm">{proj.shortDescription}</p>
            </div>
          </Link>
        )) : <p className="col-span-3 text-center text-gray-500">No projects found in this category.</p>}
      </div>
    </div>
  );
}
