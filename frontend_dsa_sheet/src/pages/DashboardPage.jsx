import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getProgress, getTopics, toggleProgress } from "../api";

const DashboardPage = () => {
  const [topics, setTopics] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [topicData, progressData] = await Promise.all([getTopics(), getProgress()]);
        setTopics(topicData);
        setProgress(progressData);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const progressMap = useMemo(() => {
    return new Map(progress.map((item) => [item.problem._id, item.completed]));
  }, [progress]);

  const difficultyClass = (value) => `topic-badge difficulty-${String(value || "").toLowerCase()}`;

  const updateProblem = async (problem) => {
    try {
      const updated = await toggleProgress(problem._id, !progressMap.get(problem._id));
      setProgress((current) => {
        const copy = current.filter((item) => item.problem._id !== problem._id);
        return [...copy, updated];
      });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update problem status.");
    }
  };

  if (loading) {
    return <div className="page-shell">Loading dashboard...</div>;
  }

  return (
    <main className="page-shell">
      <section className="page-heading">
        <div>
          <p className="eyebrow">DSA Sheet</p>
          <h1>Your learning dashboard</h1>
          <p className="subtext">
            Browse topics, mark problems as complete, and measure your progress in one place.
          </p>
        </div>
        <div className="summary-card">
          <p>Topics covered</p>
          <strong>{topics.length}</strong>
          <p>Problems tracked</p>
          <strong>{topics.reduce((sum, topic) => sum + topic.problems.length, 0)}</strong>
        </div>
      </section>

      {error && <div className="alert-error">{error}</div>}

      <section className="grid-layout">
        {topics.map((topic) => {
          const solved = topic.problems.filter((problem) => progressMap.get(problem._id)).length;
          const total = topic.problems.length;

          return (
            <article key={topic._id} className="topic-card">
              <div className="topic-header">
                <div>
                  <h2>{topic.title}</h2>
                  <p>{topic.description}</p>
                </div>
                <span className={difficultyClass(topic.difficulty)}>{topic.difficulty}</span>
              </div>

              <div className="topic-meta">
                <span>{solved}/{total} solved</span>
                <Link to={`/topic/${topic._id}`} className="text-link">
                  View topic
                </Link>
              </div>

              <ul className="problem-list">
                {topic.problems.slice(0, 3).map((problem) => (
                  <li key={problem._id} className="problem-item">
                    <div className="problem-tile">
                      <Link to={`/topic/${topic._id}`} className="problem-link">
                        <strong>{problem.title}</strong>
                      </Link>
                      <p>{problem.description}</p>
                    </div>
                    <div className="problem-actions">
                      <button
                        type="button"
                        className={progressMap.get(problem._id) ? "pill pill-success" : "pill"}
                        onClick={() => updateProblem(problem)}
                      >
                        {progressMap.get(problem._id) ? "Solved" : "Mark solved"}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </section>
    </main>
  );
};

export default DashboardPage;
