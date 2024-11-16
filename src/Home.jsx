import PopularMovies from "./HomeComponents/PopularMovies.jsx";
import TrendingMovies from "./HomeComponents/TrendingMovies.jsx";
import PopularTVshows from "./HomeComponents/PopularTVshows.jsx";
import Navigation from "./components/Navigation.jsx";
import FinKinoMovies from "./HomeComponents/FinKinoMovies.jsx";

export default function Home() {
    return (
        <div>
            <Navigation />

            <PopularMovies />
            <TrendingMovies />
            <PopularTVshows />
            <FinKinoMovies />
        </div>
    );
}