import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../AuthContext';

const RecruiterLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState(''); // New state for password-specific error
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (newPassword.length > 12) {
      setPasswordError('Password must be 12 characters or fewer');
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length > 12) {
      setError('Password must be 12 characters or fewer');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/recruiter-login', { email, password });
      const { token } = response.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('userEmail', email);
      login('recruiter');
      navigate('/recruiter-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  const isSubmitDisabled = password.length > 12; // Disable submit button if password is too long

  return (
<div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
<div className="relative py-3 sm:max-w-xl sm:mx-auto">
  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
  <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
    <form onSubmit={handleSubmit}>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-semibold">Login</h1>
        <div className="divide-y divide-gray-200">
          <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="relative">
              <input
                type="text"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-cyan-500"
                placeholder="Email address"
                required
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
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handlePasswordChange} // Updated to use new handler
                className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-cyan-500"
                placeholder="Password"
                required
              />
              <label
                htmlFor="password"
                className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
              >
                Password
              </label>
              {passwordError && <div className="text-red-500 text-sm mt-1">{passwordError}</div>} {/* Display password-specific error */}
            </div>
            <div className="relative">
              <button
                type="submit"
                className={`bg-cyan-500 text-white rounded-md hover:bg-cyan-400 px-2 py-1 ${isSubmitDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isSubmitDisabled} // Disable button if password is too long
              >
                Log In
              </button>
            </div>
            <div>
              <p className="mt-3 text-center text-sm text-gray-700">
                Don't Have An Account?
                <a
                  className="text-cyan-500 underline hover:text-cyan-400 ml-1"
                  href="/recruiter-signup"
                >
                  Signup here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</div>
</div>
);
 
};

export default RecruiterLogin;