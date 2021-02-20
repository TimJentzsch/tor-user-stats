import styles from './Content.module.css';

/** A wrapper for the content of the app. Makes sure that the footer is pushed down to the bottom. */
export default function Content(props) {
  return <div className={styles.content}>{props.children}</div>;
}
