// import React from 'react';
// import logo from './logo.svg';
import './App.css';
import Home from './Home';
import MovieDetails from './components/MovieDetails'; // Import the MovieDetails component
import TVShowDetails from './components/TVShowDetails'; // Import the TVShowDetails component
import Authentication, { AuthenticationMode } from './UserComponents/Authentication.jsx'; // Import the Authentication component
import UserProvider from './UserComponents/UserProvider.jsx'; // Import the UserProvider component
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.tsx</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header>
  //   </div>
  // );
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Home />} /> {/* Set Home as the default route */}
          <Route path="/movie/:id" element={<MovieDetails />} /> {/* Movie Details page */}
          <Route path="/tv/:id" element={<TVShowDetails />} /> {/* TV Show Details page */}
          <Route path="/login" element={<Authentication authenticationMode={AuthenticationMode.Login} />} /> {/* Login page */}
          <Route path="/register" element={<Authentication authenticationMode={AuthenticationMode.Register} />} /> {/* Register page */}
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;