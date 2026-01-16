import React from 'react';
import SignupForm from '../components/SignupForm';

const Signup = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Signup</h2>
  <SignupForm />
    </div>
  );
};

export default Signup;
