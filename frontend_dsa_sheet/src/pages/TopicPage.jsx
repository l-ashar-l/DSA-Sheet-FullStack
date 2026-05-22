import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getProgress, getTopicById, toggleProgress } from "../api";

const TopicPage = () => {
  const { id } = useParams();
  const [topicDetail, setTopicDetail] = useState(null);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [topicResult, progressData] = await Promise.all([getTopicById(id), getProgress()]);
        setTopicDetail(topicResult);
        setProgress(progressData);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load topic details.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const progressMap = useMemo(() => new Map(progress.map((item) => [item.problem._id, item.completed])), [progress]);

  const difficultyClass = (value) => `topic-badge difficulty-${String(value || "").toLowerCase()}`;

  const handleToggle = async (problem) => {
    try {
      const updated = await toggleProgress(problem._id, !progressMap.get(problem._id));
      setProgress((current) => {
        const filtered = current.filter((item) => item.problem._id !== problem._id);
        return [...filtered, updated];
      });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update problem status.");
    }
  };

  if (loading) {
    return <div className="page-shell">Loading topic information...</div>;
  }

  if (!topicDetail) {
    return <div className="page-shell">Topic not found.</div>;
  }

  return (
    <main className="page-shell">
      <section className="topic-hero">
        <div>
          <p className="eyebrow">Topic detail</p>
          <h1>{topicDetail.topic.title}</h1>
          <p>{topicDetail.topic.description}</p>
        </div>
        <div className="topic-summary">
          <strong>{topicDetail.problems.length} problems</strong>
        </div>
      </section>

      {error && <div className="alert-error">{error}</div>}

      <section className="grid-layout">
        {topicDetail.problems.map((problem) => (
          <article key={problem._id} className="topic-card">
            <div className="topic-header">
              <h2>{problem.title}</h2>
              <span className={difficultyClass(problem.difficulty)}>{problem.difficulty}</span>
            </div>
            <p>{problem.description}</p>
            <div className="resource-row">
              {problem.resources?.youtube && (
                <a href={problem.resources.youtube} target="_blank" rel="noreferrer" className="text-link">
                  Watch video
                </a>
              )}
              {problem.resources?.article && (
                <a href={problem.resources.article} target="_blank" rel="noreferrer" className="text-link">
                  Read article
                </a>
              )}
              <a href={problem.resources.practice} target="_blank" rel="noreferrer" className="text-link">
                Practice
              </a>
            </div>
            <div className="topic-actions">
              <button
                type="button"
                className={progressMap.get(problem._id) ? "pill pill-success" : "pill"}
                onClick={() => handleToggle(problem)}
              >
                {progressMap.get(problem._id) ? "Solved" : "Mark solved"}
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
};

export default TopicPage;
