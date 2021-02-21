import styles from './Content.module.css';

interface ContentProps {
  children?: JSX.Element | JSX.Element[];
}

/** A wrapper for the content of the app. Makes sure that the footer is pushed down to the bottom. */
export default function Content(props: ContentProps): JSX.Element {
  return <div className={styles.content}>{props.children}</div>;
}
