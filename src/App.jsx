import './App.css';
import './index.css';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <AppRoutes/>
  );
}

export default App;

// import React from 'react'
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import LoginScreen from './screens/LoginScreen'
// import SignupScreen from './screens/SignupScreen'
// import Dashboard from './screens/Dashboard'


// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<LoginScreen />} />
//         <Route path="/signup" element={<SignupScreen />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//       </Routes>
//     </Router>
//   )
// }

// export default App
