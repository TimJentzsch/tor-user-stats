import './Header.module.css';

export default function Header() {
  return (
    <header className="header">
      <div id="header-content">
        <a id="header-link" href="index.html">
          <img id="header-icon" src="../images/favicon.svg" alt="tor-user-stats icon" />
          <h1>tor-user-stats</h1>
        </a>
        <div id="header-search-container" className="search-container">
          <form id="header-search-form" className="search-form" onSubmit={() => false}>
            <label htmlFor="header-user-input">/u/</label>
            <input
              id="header-user-input"
              className="user-input"
              placeholder="username"
              autoFocus
              type="text"
            />
            <input
              id="header-search-button"
              className="search-button"
              type="submit"
              value="search"
            />
          </form>
        </div>
        <a
          href="https://github.com/TimJentzsch/tor-user-stats"
          title="Check out the project on GitHub"
        >
          <img width="35px" height="35px" src="../images/github-icon.png" alt="GitHub icon" />
        </a>
      </div>
    </header>
  );
}
