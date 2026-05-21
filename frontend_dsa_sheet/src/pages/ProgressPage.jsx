import { useEffect, useState } from "react";
import { getProgress, toggleProgress } from "../api";

const ProgressPage = () => {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProgress = async () => {
      setLoading(true);
      try {
        const data = await getProgress();
        setProgress(data);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load progress.");
      } finally {
        setLoading(false);
      }
    };
    loadProgress();
  }, []);

  const handleToggle = async (item) => {
    try {
      const updated = await toggleProgress(item.problem._id, !item.completed);
      setProgress((current) => current.map((record) => (record._id === updated._id ? updated : record)));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update progress.");
    }
  };

  return (
    <main className="page-shell">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Progress tracker</p>
          <h1>Your solved problems</h1>
          <p className="subtext">
            Review the problems you've marked and switch completion status instantly.
          </p>
        </div>
      </section>

      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <div>Loading progress...</div>
      ) : (
        <section className="grid-layout">
          {progress.length ? (
            progress.map((item) => (
              <article key={item._id} className="topic-card">
                <div className="topic-header">
                  <div>
                    <h2>{item.problem.title}</h2>
                    <span className={`topic-badge difficulty-${String(item.problem.difficulty || "").toLowerCase()}`}>
                      {item.problem.difficulty}
                    </span>
                  </div>
                  <span className={item.completed ? "pill pill-success" : "pill"}>
                    {item.completed ? "Solved" : "Pending"}
                  </span>
                </div>
                <p>Topic: {item.problem.topic}</p>
                <button type="button" className="primary-button" onClick={() => handleToggle(item)}>
                  {item.completed ? "Mark pending" : "Mark solved"}
                </button>
              </article>
            ))
          ) : (
            <div className="empty-state">No progress recorded yet. Start solving problems in the dashboard.</div>
          )}
        </section>
      )}
    </main>
  );
};

export default ProgressPage;
