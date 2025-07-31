import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SeekerSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cnic, setCnic] = useState('');
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (newPassword.length > 12) {
      setPasswordError('Password must be 12 characters or fewer');
    } else {
      setPasswordError('');
    }
  };

  const handleSeekerSignup = async (e) => {
    e.preventDefault();
    setError('');

    // Check if all required fields are provided
    if (!firstName || !lastName || !cnic || !email || !password) {
      setError('Please provide all required fields');
      return;
    }

    // Log the data being sent to verify
    const signupData = { firstName, lastName, cnic, email, password };
    console.log('Sending signup data:', signupData);

    if (password.length > 12) {
      setError('Password must be 12 characters or fewer');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/jobseeker-signup', signupData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userEmail', email);
      navigate('/jobseeker-Dashboard');
    } catch (err) {
      console.error('Signup error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Error during signup');
    }
  };

  const isSubmitDisabled = password.length > 12;

  return (
    <div>
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <form onSubmit={handleSeekerSignup}>
              <div className="max-w-md mx-auto">
                <div>
                  <h1 className="text-2xl font-semibold">SignUp</h1>
                </div>
                {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
                <div className="divide-y divide-gray-200">
                  <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                    <div className="relative">
                      <input
                        autoComplete="off"
                        id="firstName"
                        name="firstName"
                        type="text"
                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                      <label
                        htmlFor="firstName"
                        className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                      >
                        First Name
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        autoComplete="off"
                        id="lastName"
                        name="lastName"
                        type="text"
                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                      <label
                        htmlFor="lastName"
                        className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                      >
                        Last Name
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        autoComplete="off"
                        id="cnic"
                        name="cnic"
                        type="text"
                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                        placeholder="CNIC"
                        value={cnic}
                        onChange={(e) => setCnic(e.target.value)}
                      />
                      <label
                        htmlFor="cnic"
                        className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                      >
                        CNIC
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        autoComplete="off"
                        id="email"
                        name="email"
                        type="text"
                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <label
                        htmlFor="email"
                        className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                      >
                        Email Address
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        autoComplete="off"
                        id="password"
                        name="password"
                        type="password"
                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                        placeholder="Password"
                        value={password}
                        onChange={handlePasswordChange}
                      />
                      <label
                        htmlFor="password"
                        className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                      >
                        Password
                      </label>
                      {passwordError && <div className="text-red-500 text-sm mt-1">{passwordError}</div>}
                    </div>
                    <div className="relative">
                      <button
                        type="submit"
                        className={`bg-cyan-500 text-white rounded-md hover:bg-cyan-400 px-2 py-1 ${isSubmitDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isSubmitDisabled}
                      >
                        Sign up
                      </button>
                    </div>
                    <div className="">
                      <div className="mt-3 text-center text-sm dark:text-gray-700">
                        Already Have An Account?{' '}
                        <a className="text-cyan-500 underline hover:text-cyan-400 ml-1" href="/jobseeker-login">
                          Log In here
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeekerSignup;