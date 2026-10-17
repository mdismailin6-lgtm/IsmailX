import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Project } from "../types";
import { renderIfVisible } from "../utils/render";
import { ExternalLink, Github, Globe } from "lucide-react";

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      const q = query(collection(db, "projects"), where("slug", "==", slug), where("isVisible", "==", true));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const docData = snap.docs[0];
        setProject({ id: docData.id, ...docData.data() } as Project);
      }
      setLoading(false);
    };
    fetchProject();
  }, [slug]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!project) return <div className="p-8 text-center">Project not found.</div>;

  const v = project.visibility;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <Link to="/" className="text-blue-600 hover:underline">&larr; Back to Home</Link>

      {renderIfVisible(v.coverImage, project.coverImageUrl, (
        <img src={project.coverImageUrl} alt="Cover" className="w-full h-64 object-cover rounded-xl" />
      ))}

      <div>
        <h1 className="text-4xl font-bold">{project.name}</h1>
        {renderIfVisible(v.description, project.shortDescription, (
          <p className="text-xl text-gray-600 mt-2">{project.shortDescription}</p>
        ))}
      </div>

      {renderIfVisible(v.purpose, project.purpose, (
        <section className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">Purpose</h2>
          <p>{project.purpose}</p>
        </section>
      ))}

      {renderIfVisible(v.description, project.fullDescription, (
        <section>
          <h2 className="text-2xl font-semibold mb-2">Full Description</h2>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: project.fullDescription }} />
        </section>
      ))}

      <div className="grid md:grid-cols-2 gap-6">
        {renderIfVisible(v.technologies, project.technologies, (
          <section>
            <h3 className="text-xl font-semibold mb-2">Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, i) => (
                <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{tech}</span>
              ))}
            </div>
          </section>
        ))}
        {renderIfVisible(v.features, project.features, (
          <section>
            <h3 className="text-xl font-semibold mb-2">Key Features</h3>
            <ul className="list-disc list-inside space-y-1">
              {project.features.map((feat, i) => <li key={i}>{feat}</li>)}
            </ul>
          </section>
        ))}
      </div>

      {renderIfVisible(v.gallery, project.gallery, (
        <section>
          <h3 className="text-xl font-semibold mb-2">Gallery</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {project.gallery.map((img, i) => (
              <img key={i} src={img} alt={`Gallery ${i}`} className="rounded-lg object-cover h-40 w-full" loading="lazy" />
            ))}
          </div>
        </section>
      ))}

      {renderIfVisible(v.video, project.videoUrl, (
        <section>
          <h3 className="text-xl font-semibold mb-2">Video Demo</h3>
          <video src={project.videoUrl} controls className="w-full rounded-lg" />
        </section>
      ))}

      <section className="flex flex-wrap gap-4">
        {renderIfVisible(v.liveDemoUrl, project.links?.liveDemoUrl, (
          <a href={project.links!.liveDemoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Globe size={18} /> Live Demo
          </a>
        ))}
        {renderIfVisible(v.sourceCodeUrl, project.links?.sourceCodeUrl, (
          <a href={project.links!.sourceCodeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900">
            <Github size={18} /> Source Code
          </a>
        ))}
        {renderIfVisible(v.externalUrl, project.links?.externalUrl, (
          <a href={project.links!.externalUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <ExternalLink size={18} /> External Link
          </a>
        ))}
      </section>
    </div>
  );
}
