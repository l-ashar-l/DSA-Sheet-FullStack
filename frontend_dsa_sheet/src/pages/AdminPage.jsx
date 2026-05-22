import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../AuthContext";
import { createProblem, createTopic, getTopics } from "../api";

const difficulties = ["Easy", "Medium", "Hard"];

const AdminPage = () => {
  const { user } = useAuth();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [topicForm, setTopicForm] = useState({
    title: "",
    slug: "",
    description: "",
    resources: { youtube: "", article: "", practice: "" },
    order: 1,
  });

  const [problemForm, setProblemForm] = useState({
    topicId: "",
    title: "",
    description: "",
    difficulty: "Medium",
    resources: { youtube: "", article: "", practice: "" },
    order: 1,
  });

  useEffect(() => {
    const loadTopics = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getTopics();
        setTopics(data);
        if (data.length > 0) {
          setProblemForm((current) => ({ ...current, topicId: current.topicId || data[0]._id }));
        }
      } catch (err) {
        setError(err.response?.data?.message || "Unable to fetch topics.");
      } finally {
        setLoading(false);
      }
    };
    loadTopics();
  }, []);

  const resetTopicForm = () => {
    setTopicForm({
      title: "",
      slug: "",
      description: "",
      resources: { youtube: "", article: "", practice: "" },
      order: 1,
    });
  };

  const resetProblemForm = () => {
    setProblemForm((current) => ({
      ...current,
      title: "",
      description: "",
      difficulty: "Medium",
      resources: { youtube: "", article: "", practice: "" },
      order: 1,
    }));
  };

  const handleTopicSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await createTopic(topicForm);
      setSuccess("Topic created successfully.");
      resetTopicForm();
      const refreshed = await getTopics();
      setTopics(refreshed);
      if (!problemForm.topicId && refreshed.length > 0) {
        setProblemForm((current) => ({ ...current, topicId: refreshed[0]._id }));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create topic.");
    }
  };

  const handleProblemSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await createProblem(problemForm);
      setSuccess("Problem created successfully.");
      resetProblemForm();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create problem.");
    }
  };

  const updateTopicResource = (field, value) => {
    setTopicForm((current) => ({
      ...current,
      resources: { ...current.resources, [field]: value },
    }));
  };

  const updateProblemResource = (field, value) => {
    setProblemForm((current) => ({
      ...current,
      resources: { ...current.resources, [field]: value },
    }));
  };

  const canAccess = user?.role === "admin";

  if (!canAccess) {
    return (
      <main className="page-shell">
        <section className="page-heading">
          <p className="eyebrow">Admin area</p>
          <h1>Access restricted</h1>
          <p className="subtext">Only admin users can add topics and problems.</p>
        </section>
        <div className="alert-error">You do not have permission to access this page.</div>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Admin tools</p>
          <h1>Add topics & problems</h1>
          <p className="subtext">Create new learning topics and attach practice problems to them.</p>
        </div>
      </section>

      {loading && <div className="page-shell">Loading admin tools...</div>}
      {error && <div className="alert-error">{error}</div>}
      {success && <div className="alert-success">{success}</div>}

      <section className="admin-grid">
        <article className="admin-card">
          <h2>Create topic</h2>
          <form onSubmit={handleTopicSubmit} className="form-card">
            <label>
              Title
              <input
                value={topicForm.title}
                onChange={(e) => setTopicForm({ ...topicForm, title: e.target.value })}
                required
              />
            </label>
            <label>
              Slug
              <input
                value={topicForm.slug}
                onChange={(e) => setTopicForm({ ...topicForm, slug: e.target.value })}
                required
              />
            </label>
            <label>
              Description
              <textarea
                value={topicForm.description}
                onChange={(e) => setTopicForm({ ...topicForm, description: e.target.value })}
              />
            </label>
            <label>
              Order
              <input
                type="number"
                min="1"
                value={topicForm.order}
                onChange={(e) => setTopicForm({ ...topicForm, order: Number(e.target.value) })}
              />
            </label>
            <fieldset>
              <legend>Resources</legend>
              <label>
                YouTube URL
                <input
                  value={topicForm.resources.youtube}
                  onChange={(e) => updateTopicResource("youtube", e.target.value)}
                />
              </label>
              <label>
                Article URL
                <input
                  value={topicForm.resources.article}
                  onChange={(e) => updateTopicResource("article", e.target.value)}
                />
              </label>
              <label>
                Practice URL
                <input
                  value={topicForm.resources.practice}
                  onChange={(e) => updateTopicResource("practice", e.target.value)}
                />
              </label>
            </fieldset>
            <button type="submit" className="button">
              Add Topic
            </button>
          </form>
        </article>

        <article className="admin-card">
          <h2>Create problem</h2>
          <form onSubmit={handleProblemSubmit} className="form-card">
            <label>
              Topic
              <select
                value={problemForm.topicId}
                onChange={(e) => setProblemForm({ ...problemForm, topicId: e.target.value })}
                required
              >
                <option value="" disabled>
                  Select a topic
                </option>
                {topics.map((topic) => (
                  <option key={topic._id} value={topic._id}>
                    {topic.title}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Title
              <input
                value={problemForm.title}
                onChange={(e) => setProblemForm({ ...problemForm, title: e.target.value })}
                required
              />
            </label>
            <label>
              Description
              <textarea
                value={problemForm.description}
                onChange={(e) => setProblemForm({ ...problemForm, description: e.target.value })}
              />
            </label>
            <label>
              Difficulty
              <select
                value={problemForm.difficulty}
                onChange={(e) => setProblemForm({ ...problemForm, difficulty: e.target.value })}
              >
                {difficulties.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Order
              <input
                type="number"
                min="1"
                value={problemForm.order}
                onChange={(e) => setProblemForm({ ...problemForm, order: Number(e.target.value) })}
              />
            </label>
            <fieldset>
              <legend>Resources</legend>
              <label>
                YouTube URL
                <input
                  value={problemForm.resources.youtube}
                  onChange={(e) => updateProblemResource("youtube", e.target.value)}
                />
              </label>
              <label>
                Article URL
                <input
                  value={problemForm.resources.article}
                  onChange={(e) => updateProblemResource("article", e.target.value)}
                />
              </label>
              <label>
                Practice URL
                <input
                  value={problemForm.resources.practice}
                  onChange={(e) => updateProblemResource("practice", e.target.value)}
                />
              </label>
            </fieldset>
            <button type="submit" className="button">
              Add Problem
            </button>
          </form>
        </article>
      </section>
    </main>
  );
};

export default AdminPage;
