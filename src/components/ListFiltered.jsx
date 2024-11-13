import { useParams, useLocation} from "react-router-dom"
import { useState, useEffect } from "react";
import List from "./List";

export default function ListFiltered() {
    const { condition } = useParams();
    const location = useLocation();
    const searchQuery = new URLSearchParams(location.search);
    const [body, setBody] = useState(null);
    
    const page = +searchQuery.get('page');
    const genres = searchQuery.get('genres');
    const year = searchQuery.get('year');
    const rating = searchQuery.get('rating');

    function getItems() {
        fetch(condition == 'tv' ?
            `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&with_genres=${genres}&first_air_date_year=${year}&vote_average.gte=${rating}&page=${page}` :
            `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&with_genres=${genres}&primary_release_year=${year}&vote_average.gte=${rating}&page=${page}`
        )
        .then(res => res.json())
        .then(json => {
            setBody(<List items={json.results || []} total_pages={json.total_pages || -1}/>);
        })
        .catch(error => {
            console.log(error.message);
        })
    }

    useEffect(getItems, []);

    return (
        <div>
            {body}
        </div>
    )
}