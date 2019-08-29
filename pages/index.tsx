import Head from 'next/head';
import { MainMenu } from '../components/main/MainMenu';
import withAuth from '../components/common/auth/withAuth';
import { Fragment } from 'react';

const Start: React.FC<{ user: any; className: string }> = ({
  user,
  className,
}) => {
  return (
    <Fragment>
      <Head>
        <title>Phase 10 Scorer</title>
      </Head>
      <MainMenu className={className} />
    </Fragment>
  );
};

export default Start;
