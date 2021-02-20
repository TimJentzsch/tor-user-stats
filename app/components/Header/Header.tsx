import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <a className={styles.link} href="index.html">
          <img className={styles.icon} src="/favicon.svg" alt="tor-user-stats icon" />
          <h1>tor-user-stats</h1>
        </a>
        <div className="search-container">
          <form className="search-form" onSubmit={() => false}>
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
          <img width="35px" height="35px" src="./github-icon.png" alt="GitHub icon" />
        </a>
      </div>
    </header>
  );
}
