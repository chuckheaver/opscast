// The weather page is a client component, so the site menu (a server
// component that reads the neighborhood list) wraps it from here.
import SiteNav from "../components/SiteNav";

export default function WeatherLayout({ children }) {
  return (
    <>
      <SiteNav />
      {children}
    </>
  );
}
