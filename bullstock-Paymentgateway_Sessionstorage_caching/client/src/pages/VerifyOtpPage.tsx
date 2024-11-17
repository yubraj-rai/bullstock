import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

const VERIFY_OTP = gql`
  mutation VerifyOtp($username: String!, $otp: String!) {
    verifyOtp(username: $username, otp: $otp)
  }
`;

const VerifyOtp: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [verifyOtp] = useMutation(VERIFY_OTP);
  const navigate = useNavigate();
  const username = new URLSearchParams(window.location.search).get('username') as string;
  const [errors, setErrors] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerifyOtp = async () => {
    setIsLoading(true);
    await verifyOtp({ variables: { username, otp } })
      .then(({ data }) => {
        const token = data.verifyOtp;
        setErrors('');
        navigate(`/reset?username=${username}&token=${token}`);
      })
      .catch((err) => {
        setErrors(err?.message);
        setIsLoading(false);
      });
  };

  return (
    <div className='dark:bg-darkBg h-screen w-full flex flex-auto items-center justify-center'>
      <div className='w-full max-w-sm mx-auto overflow-hidden bg-white dark:bg-darkField text-gray-700 dark:text-gray-200 rounded-2xl shadow-xl'>
        <div className='p-8 relative'>
          {/* Lock Icon */}
          <div className='flex justify-center mb-4'>
            <svg
              className='w-12 h-12 text-gray-500 dark:text-white'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'
              fill='currentColor'>
              <path
                fillRule='evenodd'
                d='M10 2a4 4 0 00-4 4v2H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-1V6a4 4 0 00-4-4zM8 6a2 2 0 114 0v2H8V6z'
                clipRule='evenodd'
              />
            </svg>
          </div>

          {/* Title and supporting text */}
          <h2 className='text-2xl font-bold text-center text-gray-700 dark:text-white'>Verify OTP</h2>
          <p className='mt-2 text-sm text-center text-gray-600 dark:text-gray-300'>
            Please enter the OTP sent to your email to verify your identity.
          </p>

          <div className='w-full mt-4'>
            <input
              className='block w-full px-4 py-2 mt-2 text-gray-700 dark:text-gray-200 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:placeholder-gray-400 focus:border-blue-500 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              type="text"
              placeholder="Enter the OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>

          <div className='flex items-center justify-center mt-5'>
            <button
              className='flex items-center justify-center w-full px-6 py-2 font-medium text-white transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-700 focus:bg-blue-700 focus:outline-none'
              onClick={handleVerifyOtp}>
              {isLoading && (
                <svg
                  className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'>
                  <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                </svg>
              )}
              Verify OTP
            </button>
          </div>
          {errors && (
            <div className='mt-4 flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800'>
              <div className='flex items-center justify-center w-12 bg-red-700 dark:bg-red-700'>
                <svg className='w-6 h-6 text-white fill-current' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'>
                  <path d='M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z' />
                </svg>
              </div>

              <div className='px-4 py-2 -mx-3'>
                <div className='mx-3'>
                  <span className='font-semibold text-red-700 dark:text-red-700'>
                    Error: <span className='text-sm text-red-700 dark:text-red-700'>{errors}</span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
