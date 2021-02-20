import styles from './UserHeader.module.css';

interface UserHeaderProps {
  username: string;
}

/** Displays general info about the user, such as the username, the total gamma and the user tags. */
export default function UserHeader(props: UserHeaderProps) {
  return (
    <div className={styles.header}>
      <a href={`https://www.reddit.com/u/${props.username}`}>
        <h2 className={styles.username}>/u/{props.username}</h2>
      </a>
      <span className={styles.gamma} title="Transcription count">
        (0 &#x393;)
      </span>
      <div className={styles.tagContainer}>
        <div className={`${styles.tag} ${styles.visitor}`}>Visitor (0)</div>
        <div className={styles.tagContainer}></div>
        <div className={styles.tag}></div>
      </div>
    </div>
  );
}
