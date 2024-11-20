import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import List from "./List";
import { xml2json } from "xml-js";

export default function ListFinKino() {
    const location = useLocation();
    const searchQuery = new URLSearchParams(location.search);
    const page = searchQuery.get('page') || 1;

    const [body, setBody] = useState(null);

    function getEvents() {
        fetch(`https://www.finnkino.fi/xml/Events/`)
        .then(res => res.text())
        .then(xml => {
            const json = JSON.parse(xml2json(xml, {compact: true}));
            const events = json.Events.Event;
            const totalPages = Math.ceil(events.length / 20);
            const listOnPage = events.filter((element, i) => ((page - 1) * 20 <= i) && (page * 20 > i));
            setBody(<List items={listOnPage} total_pages={totalPages}/>);
        })
        .catch(error => {
            console.log(error.message);
            setBody(<List items={[]} total_pages={-1}/>);
        })
    }

    useEffect(getEvents, []);

    return(
        <div>
            {body}
        </div>
    )
}