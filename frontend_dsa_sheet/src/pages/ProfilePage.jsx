import { useAuth } from "../AuthContext";

const ProfilePage = () => {
  const { user } = useAuth();
console.log(user);
  return (
    <main className="page-shell">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Account</p>
          <h1>Your profile</h1>
          <p className="subtext">
            Review your account details and stay signed in across sessions.
          </p>
        </div>
      </section>

      <section className="profile-grid">
        <article className="topic-card profile-card">
          <h2>{user?.name}</h2>
          <p className="meta-label">Email</p>
          <p>{user?.email}</p>
          <p className="meta-label">User ID</p>
          <p>{user?.id}</p>
          <p className="meta-label">Joined</p>
          <p>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Not available"}</p>
        </article>
      </section>
    </main>
  );
};

export default ProfilePage;
