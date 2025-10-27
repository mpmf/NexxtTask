import { DecorativeBlobs } from '../components/atoms/DecorativeBlobs';
import { SignUpForm } from '../components/organisms/SignUpForm';

export default function SignUp() {
  const bodyStyle = {
    fontFamily: "'Inter', sans-serif",
    background: 'linear-gradient(135deg, #e0f2f7 0%, #d4edee 50%, #fef3e2 100%)',
    minHeight: '100vh'
  };

  return (
    <div className="relative text-gray-900 flex items-center justify-center" style={bodyStyle}>
      <DecorativeBlobs />
      <SignUpForm />
    </div>
  );
}

