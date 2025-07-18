


// // components/auth/Login.js
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';

// const Login = () => {
//   const [activeTab, setActiveTab] = useState('user');
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const [debugInfo, setDebugInfo] = useState(null); // Debug info
//   const navigate = useNavigate();
//   const { login, redirectBasedOnRole, currentUser, userRole } = useAuth();

//   // Check if already logged in
//   useEffect(() => {
//     if (currentUser && userRole) {
//       console.log("Login - Already logged in as:", userRole);
//       redirectBasedOnRole(userRole);
//     }
//   }, [currentUser, userRole, redirectBasedOnRole]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     // Clear error when user starts typing
//     if (error) setError(null);
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     setError(null);
//     setSuccess(null);
//     setDebugInfo(null);
//     setFormData({ email: '', password: '' });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);
//     setSuccess(null);
//     setDebugInfo(null);
    
//     try {
//       console.log(`Login attempt - Email: ${formData.email}, Role tab: ${activeTab}`);
      
//       // Use login function from AuthContext
//       const result = await login(formData.email, formData.password);
      
//       // Debug information
//       setDebugInfo({
//         result: result,
//         resultRole: result.role,
//         currentUser: currentUser,
//         userRole: userRole
//       });
      
//       console.log("Login successful:", result);
//       console.log("User role:", result.role);
      
//       // Show success message
//       setSuccess(`Login successful! Redirecting to ${result.role} dashboard...`);
      
//       // Redirect after short delay
//       setTimeout(() => {
//         redirectBasedOnRole(result.role);
//       }, 2000);
      
//     } catch (error) {
//       console.error('Login failed:', error);
//       setError(error.message || 'An error occurred during login. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
//         <div className="text-center p-6 bg-white">
//           <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
//           <p className="mt-2 text-gray-600">Sign in to your account</p>
//         </div>

//         {/* Tab Navigation */}
//         <div className="flex border-b">
//           <button
//             onClick={() => handleTabChange('admin')}
//             className={`flex-1 py-4 px-6 text-center font-medium ${
//               activeTab === 'admin'
//                 ? 'text-white bg-blue-500'
//                 : 'text-gray-500 hover:text-gray-700 bg-gray-50'
//             }`}
//           >
//             Admin Login
//           </button>
//           <button
//             onClick={() => handleTabChange('veterinary')}
//             className={`flex-1 py-4 px-6 text-center font-medium ${
//               activeTab === 'veterinary'
//                 ? 'text-white bg-blue-500'
//                 : 'text-gray-500 hover:text-gray-700 bg-gray-50'
//             }`}
//           >
//             Veterinary
//           </button>
//           <button
//             onClick={() => handleTabChange('supplier')}
//             className={`flex-1 py-4 px-6 text-center font-medium ${
//               activeTab === 'supplier'
//                 ? 'text-white bg-blue-500'
//                 : 'text-gray-500 hover:text-gray-700 bg-gray-50'
//             }`}
//           >
//             Supplier
//           </button>
//           <button
//             onClick={() => handleTabChange('user')}
//             className={`flex-1 py-4 px-6 text-center font-medium ${
//               activeTab === 'user'
//                 ? 'text-white bg-blue-500'
//                 : 'text-gray-500 hover:text-gray-700 bg-gray-50'
//             }`}
//           >
//             User Login
//           </button>
//         </div>

//         <div className="p-6">
//           {error && (
//             <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
//               <p className="text-sm">{error}</p>
//             </div>
//           )}
          
//           {success && (
//             <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
//               <p className="text-sm">{success}</p>
//             </div>
//           )}

//           {/* Debug information */}
//           {debugInfo && (
//             <div className="mb-4 p-3 bg-gray-100 border border-gray-400 text-gray-700 rounded text-xs">
//               <p className="font-bold">Debug Info:</p>
//               <p>Result Role: {debugInfo.resultRole}</p>
//               <p>Current Role: {userRole}</p>
//             </div>
//           )}

//           <form onSubmit={handleSubmit}>
//             <div className="mb-4">
//               <div className="flex items-center border rounded-lg px-3 py-2 mb-4">
//                 <svg className="h-5 w-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                   <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
//                   <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
//                 </svg>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   placeholder="Email address"
//                   className="w-full outline-none text-gray-700"
//                   required
//                   disabled={isLoading}
//                 />
//               </div>
//               <div className="flex items-center border rounded-lg px-3 py-2">
//                 <svg className="h-5 w-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
//                 </svg>
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   name="password"
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   placeholder="Password"
//                   className="w-full outline-none text-gray-700 pr-10"
//                   required
//                   disabled={isLoading}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   {showPassword ? (
//                     <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                     </svg>
//                   ) : (
//                     <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
//                     </svg>
//                   )}
//                 </button>
//               </div>
              
//               {/* Role-specific login hints */}
//               {activeTab === 'admin' && (
//                 <div className="mt-2 p-2 bg-blue-50 text-xs text-blue-600 rounded">
//                   <strong>Admin Hint:</strong> Use admin@platform.com / admin123
//                 </div>
//               )}
              
//               {activeTab === 'user' && (
//                 <div className="mt-2 p-2 bg-blue-50 text-xs text-blue-600 rounded">
//                   <strong>User Hint:</strong> Use any email / password combination
//                 </div>
//               )}
              
//               {activeTab === 'veterinary' && (
//                 <div className="mt-2 p-2 bg-blue-50 text-xs text-blue-600 rounded">
//                   <strong>Veterinary Hint:</strong> Use the email/password created by admin
//                 </div>
//               )}
              
//               {activeTab === 'supplier' && (
//                 <div className="mt-2 p-2 bg-blue-50 text-xs text-blue-600 rounded">
//                   <strong>Supplier Hint:</strong> Use the email/password created by admin
//                 </div>
//               )}
//             </div>
            
//             <div className="text-right mb-4">
//               <a href="#" className="text-sm text-blue-500 hover:underline">Forgot Password?</a>
//             </div>
            
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition duration-200 font-medium"
//             >
//               {isLoading ? (
//                 <div className="flex justify-center items-center">
//                   <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Signing In...
//                 </div>
//               ) : (
//                 'Sign In'
//               )}
//             </button>
//           </form>
          
//           {activeTab === 'user' && (
//             <div className="mt-6 text-center">
//               <p className="text-gray-600 text-sm">
//                 Don't have an account?{' '}
//                 <button
//                   type="button"
//                   onClick={() => navigate('/register')}
//                   className="text-blue-500 hover:text-blue-700 font-medium"
//                   disabled={isLoading}
//                 >
//                   Sign up here
//                 </button>
//               </p>
//             </div>
//           )}
          
//           {(activeTab === 'veterinary' || activeTab === 'supplier') && (
//             <div className="mt-6 p-4 bg-gray-50 rounded-lg">
//               <p className="text-sm text-gray-600">
//                 <strong>Note:</strong> {activeTab === 'veterinary' ? 'Veterinary' : 'Supplier'} accounts are created by administrators. 
//                 Please contact the admin if you need access.
//               </p>
//             </div>
//           )}
          
//           {activeTab === 'admin' && (
//             <div className="mt-6 p-4 bg-gray-50 rounded-lg">
//               <p className="text-sm text-gray-600">
//                 <strong>Admin Login:</strong> Use the credentials provided by the system administrator.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;



// components/auth/Login.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [activeTab, setActiveTab] = useState('user');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const { login, currentUser, userRole } = useAuth();

  // This useEffect will check if the user is already logged in and redirect accordingly
  useEffect(() => {
    console.log("Login component - Checking authentication state");
    console.log("Current user:", currentUser);
    console.log("User role:", userRole);
    
    // If user is logged in, redirect based on role
    if (currentUser && userRole) {
      console.log(`User already logged in as ${userRole}, redirecting...`);
      navigateToRoleDashboard(userRole);
    }
  }, [currentUser, userRole]);

  const navigateToRoleDashboard = (role) => {
    // Convert role to lowercase for consistency
    const normalizedRole = role.toLowerCase();
    console.log(`Navigating to dashboard for role: ${normalizedRole}`);
    
    // Determine redirect path based on user role
    switch (normalizedRole) {
      case 'admin':
        navigate('/admin/AdminDashboard', { replace: true });
        break;
      case 'supplier':
        navigate('/supplier/supplierDashboard', { replace: true });
        break;
      case 'veterinary':
        navigate('/veterinary/vetDashboard', { replace: true });
        break;
      case 'user':
        navigate('/dashboard', { replace: true });
        break;
      default:
        // Fallback to home page if role is unknown
        navigate('/', { replace: true });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError(null);
    setSuccess(null);
    setFormData({ email: '', password: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      console.log(`Login attempt - Email: ${formData.email}, Role tab: ${activeTab}`);
      
      // Use login function from AuthContext
      const result = await login(formData.email, formData.password);
      
      console.log("Login successful:", result);
      console.log("User role:", result.role);
      
      // Show success message briefly
      setSuccess(`Login successful! Redirecting to ${result.role} dashboard...`);
      
      // CRITICAL: Use the navigate function directly instead of relying on the context
      setTimeout(() => {
        navigateToRoleDashboard(result.role);
      }, 1000);
      
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.message || 'An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="text-center p-6 bg-white">
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b">
          <button
            onClick={() => handleTabChange('admin')}
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === 'admin'
                ? 'text-white bg-blue-500'
                : 'text-gray-500 hover:text-gray-700 bg-gray-50'
            }`}
          >
            Admin Login
          </button>
          <button
            onClick={() => handleTabChange('veterinary')}
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === 'veterinary'
                ? 'text-white bg-blue-500'
                : 'text-gray-500 hover:text-gray-700 bg-gray-50'
            }`}
          >
            Veterinary
          </button>
          <button
            onClick={() => handleTabChange('supplier')}
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === 'supplier'
                ? 'text-white bg-blue-500'
                : 'text-gray-500 hover:text-gray-700 bg-gray-50'
            }`}
          >
            Supplier
          </button>
          <button
            onClick={() => handleTabChange('user')}
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === 'user'
                ? 'text-white bg-blue-500'
                : 'text-gray-500 hover:text-gray-700 bg-gray-50'
            }`}
          >
            User Login
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              <p className="text-sm">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <div className="flex items-center border rounded-lg px-3 py-2 mb-4">
                <svg className="h-5 w-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email address"
                  className="w-full outline-none text-gray-700"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="flex items-center border rounded-lg px-3 py-2">
                <svg className="h-5 w-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="w-full outline-none text-gray-700 pr-10"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  )}
                </button>
              </div>
              
              {/* Role-specific login hints */}
              {activeTab === 'admin' && (
                <div className="mt-2 p-2 bg-blue-50 text-xs text-blue-600 rounded">
                  <strong>Admin Hint:</strong> Use admin@platform.com / admin123
                </div>
              )}
              
              {activeTab === 'user' && (
                <div className="mt-2 p-2 bg-blue-50 text-xs text-blue-600 rounded">
                  <strong>User Hint:</strong> Use sushma@gmail.com / sushma123
                </div>
              )}
              
              {activeTab === 'veterinary' && (
                <div className="mt-2 p-2 bg-blue-50 text-xs text-blue-600 rounded">
                  <strong>Veterinary Hint:</strong> Use manu123@gmai.com / (no password needed for testing)
                </div>
              )}
              
              {activeTab === 'supplier' && (
                <div className="mt-2 p-2 bg-blue-50 text-xs text-blue-600 rounded">
                  <strong>Supplier Hint:</strong> Use suma@gmail.com / (no password needed for testing)
                </div>
              )}
            </div>
            
            <div className="text-right mb-4">
              <a href="#" className="text-sm text-blue-500 hover:underline">Forgot Password?</a>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition duration-200 font-medium"
            >
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          
          {activeTab === 'user' && (
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="text-blue-500 hover:text-blue-700 font-medium"
                  disabled={isLoading}
                >
                  Sign up here
                </button>
              </p>
            </div>
          )}
          
          {(activeTab === 'veterinary' || activeTab === 'supplier') && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Note:</strong> {activeTab === 'veterinary' ? 'Veterinary' : 'Supplier'} accounts are created by administrators. 
                Please contact the admin if you need access.
              </p>
            </div>
          )}
          
          {activeTab === 'admin' && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Admin Login:</strong> Use the credentials provided by the system administrator.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;