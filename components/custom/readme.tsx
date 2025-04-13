import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

interface ReadmeProps {
  repoUrl: string;
}

const Readme: React.FC<ReadmeProps> = ({ repoUrl }) => {
  const [readmeContent, setReadmeContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReadme = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${repoUrl}/readme`,
          {
            headers: {
              Accept: "application/vnd.github.v3+json",
              Authorization: `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch README");
        }

        const data = await response.json();
        const decodedContent = atob(data.content); // Decode the Base64 content
        setReadmeContent(decodedContent);
      } catch (err) {
        setError("Unable to load README file");
      } finally {
        setLoading(false);
      }
    };

    fetchReadme();
  }, [repoUrl]);

  if (loading) return <div>Loading README...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>README</h2>
      <ReactMarkdown>{readmeContent}</ReactMarkdown>
    </div>
  );
};

export default Readme;
