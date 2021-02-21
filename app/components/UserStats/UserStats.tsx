import * as React from 'react';
import GammaTable from '../GammaTable/GammaTable';
import UserHeader from '../UserHeader/UserHeader';
import styles from './UserStats.module.css';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface UserStatsProps {}

interface UserStatsState {
  userName: string;
}

/** Provides all statistics about the given user. */
export default class UserStats extends React.Component<UserStatsProps, UserStatsState> {
  constructor(props: UserStatsProps) {
    super(props);

    this.state = {
      userName: undefined,
    };
  }

  render(): JSX.Element {
    return (
      <div>
        <UserHeader username={this.state.userName} />
        <div className={styles.userStats}>
          <GammaTable />
        </div>
      </div>
    );
  }

  componentDidMount(): void {
    const queryParams = new URLSearchParams(window.location.search);
    const userName = queryParams.get('user');

    this.setState((state) => {
      return {
        ...state,
        userName,
      };
    });
  }
}
