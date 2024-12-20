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
import CreateGroupForm from "./components/GroupComponents/CreateGroupForm";
import FinKinoMovieError from "./components/FinKinoMovieError";
import ListFinKino from "./components/ListFinKino";
import ContentDetails from "./components/ContentDetails";
import { FavoriteProvider } from "./UserComponents/FavoriteProvider";
import ListGenres from "./components/ListGenres";
import ListSearchResults from "./components/ListSearchResults";
import GroupProvider from "./UserComponents/GroupProvider";
import Test from "./Test";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <FavoriteProvider>
          <GroupProvider>
            <Routes>
              <Route path="/test" element={<Test />} />
              <Route path="/" element={<Home />} />
              <Route path="/:mediaType/:id" element={<ContentDetails />} />
              <Route
                path="/login"
                element={
                  <Authentication
                    authenticationMode={AuthenticationMode.Login}
                  />
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
              <Route
                path="/groups/all"
                element={<GroupList fetchType="all" />}
              />
              <Route path="/groups/:groupId" element={<GroupDetail />} />
              <Route
                path="/groups/user"
                element={<GroupList fetchType="user" />}
              />
              <Route path="/groups/create" element={<CreateGroupForm/>} />
              <Route
                path="/finnkino/error/:id"
                element={<FinKinoMovieError />}
              />
              <Route path="/finnkino/list" element={<ListFinKino />} />
              <Route path="/genres/list" element={<ListGenres />} />
              <Route
                path="/search/list/:condition"
                element={<ListSearchResults />}
              />
            </Routes>
          </GroupProvider>
        </FavoriteProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
