import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, query, where, getDocs, doc, getDoc, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Profile, Category, Project } from "../types";

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileDoc = await getDoc(doc(db, "profile", "main"));
        if (profileDoc.exists()) setProfile({ id: profileDoc.id, ...profileDoc.data() } as Profile);

        const catQuery = query(collection(db, "categories"), where("isVisible", "==", true), orderBy("sortOrder"));
        const catSnap = await getDocs(catQuery);
        setCategories(catSnap.docs.map(d => ({ id: d.id, ...d.data() } as Category)));

        const projQuery = query(collection(db, "projects"), where("isVisible", "==", true), where("isFeatured", "==", true));
        const projSnap = await getDocs(projQuery);
        setFeaturedProjects(projSnap.docs.map(d => ({ id: d.id, ...d.data() } as Project)));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      {profile && (
        <section className="text-center space-y-4">
          {profile.profileImageUrl && <img src={profile.profileImageUrl} alt={profile.name} className="w-32 h-32 rounded-full mx-auto object-cover" />}
          <h1 className="text-4xl font-bold">{profile.name}</h1>
          <p className="text-xl text-gray-600">{profile.professionalTitle}</p>
          <p className="max-w-2xl mx-auto text-gray-700">{profile.shortBio}</p>
        </section>
      )}

      <section>
        <h2 className="text-3xl font-bold mb-6 text-center">Explore Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(cat => (
            <Link key={cat.id} to={`/category/${cat.slug}`} className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition text-center">
              {cat.iconUrl && <img src={cat.iconUrl} alt={cat.name} className="w-12 h-12 mx-auto mb-2" />}
              <h3 className="font-semibold">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6 text-center">Featured Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {featuredProjects.map(proj => (
            <Link key={proj.id} to={`/project/${proj.slug}`} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-xl transition">
              {proj.thumbnailUrl && <img src={proj.thumbnailUrl} alt={proj.name} className="w-full h-48 object-cover" />}
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{proj.name}</h3>
                <p className="text-gray-600 text-sm">{proj.shortDescription}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
