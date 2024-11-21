import "./App.css";
import Home from "./Home";
import Authentication, {
  AuthenticationMode,
} from "./UserComponents/Authentication.jsx"; // Import the Authentication component
import UserProvider from "./UserComponents/UserProvider.jsx"; // Import the UserProvider component
import Profile from "./UserComponents/ProfilePage.jsx"; // Import the Profile component
import { BrowserRouter, Route, Routes } from "react-router-dom";

import ListCategories from "./components/ListCategories";
import ListFiltered from "./components/ListFiltered";
import GroupDetail from "./components/GroupComponents/GroupDetails";
import GroupList from "./components/GroupComponents/GroupList";
import FinKinoMovieError from "./components/FinKinoMovieError";
import ListFinKino from "./components/ListFinKino";
import ContentDetails from "./components/ContentDetails";
import ListGenres from "./components/ListGenres";
import ListSearchResults from "./components/ListSearchResults";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:mediaType/:id" element={<ContentDetails />} />
          <Route
            path="/login"
            element={
              <Authentication authenticationMode={AuthenticationMode.Login} />
            }
          />
          <Route
            path="/register"
            element={
              <Authentication
                authenticationMode={AuthenticationMode.Register}
              />
            }
          />
          <Route path="/profile/:profileId" element={<Profile />} />{" "}
          <Route path="/list/:condition" element={<ListCategories />} />
          <Route path="/filtered/:condition" element={<ListFiltered />} />
          <Route path="/groups/all" element={<GroupList fetchType="all" />} />
          <Route path="/groups/:groupId" element={<GroupDetail />} />
          <Route path="/groups/user" element={<GroupList fetchType="user" />} />
          <Route path="/finnkino/error/:id" element={<FinKinoMovieError />} />
          <Route path="/finnkino/list" element={<ListFinKino />} />
          <Route path="/genres/list" element={<ListGenres />} />
          <Route path="/search/list/:condition" element={<ListSearchResults />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
