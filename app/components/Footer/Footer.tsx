import styles from './Footer.module.css';

/** The footer of the app. Displays the third-party disclaimer and copyright information. */
export default function Footer(): JSX.Element {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <p className={styles.disclaimer}>
          <strong>Disclaimer:</strong> This is a community-maintained project and is not officially
          endorsed by{' '}
          <a href="https://www.reddit.com/r/TranscribersOfReddit/wiki/index">
            /r/TranscribersOfReddit
          </a>{' '}
          nor <a href="https://www.grafeas.org/about">Grafeas Group</a>; they are in no way involved
          with this tool and are not liable for any matters relating to it.
        </p>
        <p className={styles.copyright}>
          <strong>tor-user-stats</strong>, &#xa9; 2020 Tim Jentzsch
          <br />
          This project is available open source on{' '}
          <a href="https://github.com/TimJentzsch/tor-user-stats">GitHub</a>
        </p>
      </div>
    </footer>
  );
}
