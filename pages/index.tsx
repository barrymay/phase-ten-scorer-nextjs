import Head from 'next/head';
import { MainMenu } from '../components/main/MainMenu';
import withAuth from '../components/common/auth/withAuth';

function Start({ user }: { user: any }) {
  return (
    <div>
      <Head>
        <title>Phase 10 Scorer</title>
      </Head>
      <MainMenu />
    </div>
  );
}

export default Start;
