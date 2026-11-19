import Grid from "./Grid";
import Hero from "./Hero";

function App() {
  return (
    <>
      <div className="intro" aria-hidden="true">
        <div className="intro-content">
          <img className="intro-tiger" src="/tiger2.png" alt="" />
          <div className="loader">
            <div className="loader-bar" />
          </div>
        </div>
      </div>

      <header className="nav">
        <a className="nav-name" href="#top">
          killhavoc
        </a>
        <a className="nav-brand" href="#top" aria-label="killhavoc">
          <img src="/favicon3.png" alt="" />
        </a>
      </header>

      <main id="top">
        <Hero />

        <Grid />

        <Hero word="havoc" />
      </main>

      <footer className="footer">
        <a href="https://seun.ink" target="_blank" rel="noopener noreferrer">
          dev
        </a>
        <a
          href="https://instagram.com/killhav0c"
          target="_blank"
          rel="noopener noreferrer"
        >
          instagram
        </a>
      </footer>
    </>
  );
}

export default App;
