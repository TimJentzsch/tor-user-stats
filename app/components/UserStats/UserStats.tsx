import GammaTable from '../GammaTable/GammaTable';
import UserHeader from '../UserHeader/UserHeader';
import styles from './UserStats.module.css';

/** Provides all statistics about the given user. */
export default function UserStats(): JSX.Element {
  return (
    <div>
      <UserHeader username="Tim3303" />
      <div className={styles.userStats}>
        <GammaTable />
      </div>
    </div>
  );
}
