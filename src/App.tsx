// import React from 'react';
// import logo from './logo.svg';
import './App.css';
import Home from './Home';
import MovieDetails from './components/MovieDetails'; // Import the MovieDetails component
import TVShowDetails from './components/TVShowDetails'; // Import the TVShowDetails component
import Authentication, { AuthenticationMode } from './UserComponents/Authentication.jsx'; // Import the Authentication component
import UserProvider from './UserComponents/UserProvider.jsx'; // Import the UserProvider component
import Profile from './UserComponents/Profile.jsx'; // Import the Profile component
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import List from './components/ListCategories';
import ListCategories from './components/ListCategories';
import ListFiltered from './components/ListFiltered';
import GroupPage from './components/GroupComponents/GroupPage';
import GroupDetail from './components/GroupComponents/GroupDetails';
import GroupForm from './components/GroupComponents/GroupForm';
import JoinGroupForm from './components/GroupComponents/JoinGroupForm';

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
          <Route path="/profile/:id" element={<Profile />} /> {/* Profile page */}
          <Route path="/list/:condition" element={<ListCategories />}/>
          <Route path="/filtered/:condition" element={<ListFiltered />} />
          <Route path='/groups' element={<GroupPage/> } />
          <Route path='/groups/:groupId' element={<GroupDetail />} />
          <Route path='/groups/create' element={<GroupForm />} />
          <Route path='/groups/join' element={<JoinGroupForm />} />
          
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;