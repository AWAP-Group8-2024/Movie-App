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

    function getItems() {
        fetch(`https://api.themoviedb.org/3/discover/${condition}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&with_genres=${genres}&page=${page}`)
        .then(res => res.json())
        .then(json => {
            console.log(json);
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