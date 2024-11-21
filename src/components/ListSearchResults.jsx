import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import List from "./List";

export default function ListSearchResults() {
    const { condition } = useParams();
    const location = useLocation();
    const searchQuery = new URLSearchParams(location.search);
    const page = +searchQuery.get('page') || 1;
    const query = searchQuery.get('query') || '';

    const [body, setBody] = useState(null);

    function getResults() {
        fetch(`https://api.themoviedb.org/3/search/${condition}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&query=${query}&page=${page}`)
        .then(res => res.json())
        .then(json => {
            setBody(<List items={json.results || []} total_pages={json.total_pages || -1}/>);
        }).catch(error => {
            console.log(error.message);
        })
    }

    useEffect(getResults, []);

    return (
        <div>
            {body}
        </div>
    )
}