// The last 20 Instagram posts, pulled from the Instagram API and refreshed
// hourly. Needs two Vercel environment variables:
//
//   INSTAGRAM_ACCESS_TOKEN  a long-lived token for the account (Instagram API
//                           with Instagram Login). Tokens last 60 days;
//                           refresh with GET graph.instagram.com/refresh_access_token
//                           ?grant_type=ig_refresh_token&access_token=… before then.
//   INSTAGRAM_HANDLE        the account name, without the @ — used for the
//                           "Follow" link. Optional once the token is set; the
//                           API's own username is used if it is missing.
//
// Without a token the page still renders, with the follow link and a note in
// place of the grid, so it never breaks the site.

import Link from "next/link";
import SiteFooter from "../components/SiteFooter";

export const revalidate = 3600;

export const metadata = {
  title: "Instagram | Chuck Heaver",
  description: "The latest from Chuck Heaver on Instagram — San Francisco homes, neighborhoods, fog and weather.",
};

const API = "https://graph.instagram.com";
const FIELDS = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";

async function getFeed() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) return { posts: [], username: null, error: "no-token" };
  try {
    const [me, media] = await Promise.all([
      fetch(`${API}/me?fields=username&access_token=${token}`, { next: { revalidate } }).then(r => r.json()),
      fetch(`${API}/me/media?fields=${FIELDS}&limit=20&access_token=${token}`, { next: { revalidate } }).then(r => r.json()),
    ]);
    if (media.error) return { posts: [], username: me?.username || null, error: "api" };
    return { posts: (media.data || []).slice(0, 20), username: me?.username || null, error: null };
  } catch {
    return { posts: [], username: null, error: "api" };
  }
}

const when = t => new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export default async function Page() {
  const { posts, username, error } = await getFeed();
  const handle = process.env.INSTAGRAM_HANDLE || username;
  const profile = handle ? `https://www.instagram.com/${handle}/` : null;

  return (
    <div className="lp">
      <section className="lp-guide-head">
        <p className="lp-kicker">Instagram</p>
        <h1 className="lp-guide-h1">{handle ? `@${handle}` : "On Instagram"}</h1>
        <p className="lp-guide-lede">San Francisco homes, neighborhoods, fog and weather — the latest posts.</p>
        {profile && (
          <div className="rp-actions">
            <a className="lp-btn lp-btn-gold" href={profile} target="_blank" rel="noopener noreferrer">Follow on Instagram</a>
          </div>
        )}
      </section>

      <main className="ig">
        {posts.length ? (
          <ul className="ig-grid">
            {posts.map(p => {
              const src = p.media_type === "VIDEO" ? p.thumbnail_url : p.media_url;
              const cap = (p.caption || "").split("\n")[0];
              return (
                <li key={p.id}>
                  <a href={p.permalink} target="_blank" rel="noopener noreferrer" className="ig-post"
                     aria-label={cap ? `Instagram post: ${cap}` : "Instagram post"}>
                    {src && <img src={src} alt={cap || "Instagram post"} loading="lazy" />}
                    {p.media_type === "VIDEO" && <span className="ig-badge" aria-hidden="true">▶</span>}
                    {p.media_type === "CAROUSEL_ALBUM" && <span className="ig-badge" aria-hidden="true">❐</span>}
                    <span className="ig-cap">
                      {cap && <b>{cap.length > 110 ? cap.slice(0, 107) + "…" : cap}</b>}
                      <i>{when(p.timestamp)}</i>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="ig-empty">
            <p>
              {error === "no-token"
                ? "The feed will appear here once the Instagram connection is set up."
                : "Instagram did not answer just now — the latest posts are one click away."}
            </p>
            {profile && <a className="lp-btn lp-btn-navy" href={profile} target="_blank" rel="noopener noreferrer">See the posts on Instagram</a>}
          </div>
        )}
        {posts.length > 0 && profile && (
          <p className="ig-more"><a href={profile} target="_blank" rel="noopener noreferrer">More on Instagram &rarr;</a></p>
        )}
        <p className="ig-back"><Link href="/">&larr; Home</Link></p>
      </main>

      <SiteFooter />
    </div>
  );
}
