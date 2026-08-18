import { PageHero } from "../components.jsx";
import { Link } from "../router.jsx";

export default function NotFoundPage() {
  return <main id="main-content" tabIndex="-1"><PageHero eyebrow="404" title="The requested page could not be found." copy="The URL may have changed, or the page may not exist." actions={<><Link className="button button--primary" to="/">Return home</Link><Link className="button button--secondary" to="/services">Explore services</Link></>} compact /></main>;
}
