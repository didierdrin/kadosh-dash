import dynamic from 'next/dynamic';

const AuthContent = dynamic(() => import('./authcontent'), { ssr: false });

export default function Auth() {
  return <AuthContent />;
}