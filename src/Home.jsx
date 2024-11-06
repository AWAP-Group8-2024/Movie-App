import PopularMovies from "./HomeComponents/PopularMovies.jsx";
import TrendingMovies from "./HomeComponents/TrendingMovies.jsx";
import PopularTVshows from "./HomeComponents/PopularTVshows.jsx";
import Navigation from "./components/Navigation.jsx";

export default function Home() {
    return (
        <div>
            <Navigation />

            <PopularMovies />
            <TrendingMovies />
            <PopularTVshows />
        </div>
    );
}
