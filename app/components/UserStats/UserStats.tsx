import * as React from 'react';
import { Comment } from 'snoowrap';
import { getAllUserComments } from '../../api/reddit';
import { isComment } from '../../objects/comment';
import Transcription from '../../objects/transcription';
import GammaTable from '../GammaTable/GammaTable';
import UserHeader from '../UserHeader/UserHeader';
import styles from './UserStats.module.css';

async function getTranscriptions(
  userName: string | undefined,
  callback: (
    transcriptions: Transcription[],
    allCount: number,
    refComment: Comment | undefined,
  ) => void,
): Promise<Transcription[]> {
  if (userName === undefined) {
    return [];
  }
  console.debug(`Starting analysis for /u/${userName}:`);

  let allCount = 0;
  let commentCount = 0;
  let transcriptionCount = 0;
  let refComment: Comment | undefined;

  let transcriptions: Transcription[] = [];

  await getAllUserComments(userName, (newComments) => {
    if (newComments.length === 0) {
      return;
    }

    const endDate = new Date(newComments[0].created_utc * 1000).toISOString();
    const startDate = new Date(
      newComments[newComments.length - 1].created_utc * 1000,
    ).toISOString();

    const count = `${newComments.length}`.padStart(3);

    console.debug(`Fetched ${count} comments, from ${endDate} to ${startDate}`);
    allCount += newComments.length;

    if (!refComment) {
      // Find a reference comment to get the user flair
      refComment = newComments.find((comment) => {
        return comment.subreddit_name_prefixed === 'r/TranscribersOfReddit';
      });
    }

    const newValidComments = newComments.filter((comment) => isComment(comment));
    commentCount += newValidComments.length;

    const newTranscriptions = newValidComments
      .filter((comment) => Transcription.isTranscription(comment))
      .map((comment) => Transcription.fromComment(comment));
    transcriptionCount += newTranscriptions.length;

    transcriptions = transcriptions.concat(newTranscriptions);

    callback(transcriptions, allCount, refComment);
  });

  return transcriptions;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface UserStatsProps {}

interface UserStatsState {
  userName?: string;
  transcriptions: Transcription[];
}

/** Provides all statistics about the given user. */
export default class UserStats extends React.Component<UserStatsProps, UserStatsState> {
  constructor(props: UserStatsProps) {
    super(props);

    this.state = {
      userName: undefined,
      transcriptions: [],
    };
  }

  render(): JSX.Element {
    return (
      <div>
        <UserHeader username={this.state.userName as string} />
        <div className={styles.userStats}>
          <GammaTable />
        </div>
      </div>
    );
  }

  async componentDidMount(): Promise<void> {
    // Extract the username from the URL
    const queryParams = new URLSearchParams(window.location.search);
    const userName = queryParams.get('user') ?? undefined;

    this.setState((state) => {
      return {
        ...state,
        userName,
      };
    });

    // Analyze the transcriptions of the user
    await getTranscriptions(userName, (transcriptions) => {
      this.setState((state) => {
        return {
          ...state,
          transcriptions,
        };
      });
    });
  }
}
