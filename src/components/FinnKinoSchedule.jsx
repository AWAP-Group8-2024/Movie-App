import { xml2json } from "xml-js";
import { useEffect, useState } from "react";
import { Col, Dropdown, Row } from "react-bootstrap";

export default function FinnKinoSchedule({dataTMDB}) {
    const [area, setArea] = useState({
        ID: {_text: null},
        Name: {_text: null}
    });
    const [areas, setAreas] = useState([]);
    const [times, setTimes] = useState([]);
    const [id, setId] = useState(0);

    async function getEventInfo() {
        fetch(`https://www.finnkino.fi/xml/Events/`)
        .then(res => res.text())
        .then(xml => {
            const json = JSON.parse(xml2json(xml, {compact: true})).Events.Event;
            let currentId = 0;
            json.forEach(element => {
                if ((element.OriginalTitle._text == dataTMDB.original_title || element.OriginalTitle._text == dataTMDB.title) && dataTMDB.release_date.replaceAll(/[-].+/g,'') == element.ProductionYear._text) {
                    currentId = element.ID._text;
                    setId(currentId);
                }
            });
            if (currentId == 0) {
                setTimes(
                    <Row className="row-cols-auto">
                        <Col>Couldn't find this movie on <a href="https://www.finnkino.fi/en/elokuvat/ohjelmistossa">FinnKino</a></Col>
                    </Row>
                )
            } else {
                fetch(`https://www.finnkino.fi/xml/TheatreAreas/`)
                .then(res => res.text())
                .then(xml => {
                    const json = JSON.parse(xml2json(xml, {compact: true})).TheatreAreas.TheatreArea;
                    let setter = [];
                    json.forEach((element, i) => {
                        setter.push(
                            <Dropdown.Item onClick={() => {getTimes(element, currentId)}}>{element.Name._text}</Dropdown.Item>
                        )

                        if (i == 0) {
                            getTimes(element, currentId);
                        }
                    });
                    setAreas([...setter]);
                })
            }
        })
    }

    function getTimes(element, id) {
        setArea(element);
        fetch(`https://www.finnkino.fi/xml/Schedule?EventID=${id}&area=${element.ID._text}&nrOfDays=7`)
        .then(res => res.text())
        .then(xml => {
            const json = JSON.parse(xml2json(xml, {compact: true})).Schedule.Shows.Show || [];
            if (json.length == 0) {
                setTimes(
                    <Row className="row-cols-auto">
                        <Col>No shows available. You can try viewing <a href={`https://www.finnkino.fi/en/event/${id}`}>FinnKino</a></Col>
                    </Row>
                );
            } else {
                let setter = [];
                const months = [
                    "January", "February", "March", "April", "May", "June", 
                    "July", "August", "September", "October", "November", "December"
                ];
                const weekdays = [
                    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
                ];
                let fix = json;
                if (json.length == undefined) {
                    fix = new Array;
                    fix.push(json);
                }
                fix.forEach((element, i) => {
                    if (i < 10) {
                        const date = new Date(element.dttmShowStart._text);
                        setter.push(
                            <Row className="row-cols-auto">
                                <Col>
                                    {weekdays[date.getDay()]}, {date.getDate()} {months[date.getMonth()]}, {date.getHours()}:{date.getMinutes()};
                                    {' '}{Math.floor(+element.LengthInMinutes._text / 60)} h {+element.LengthInMinutes._text % 60} min;
                                    {' '}{element.TheatreAndAuditorium._text}
                                </Col>
                            </Row>
                        )
                    } 
                })
                setter.push(
                    <Row className="row-cols-auto">
                        <Col>
                            <a href={`https://www.finnkino.fi/en/event/${id}`}>View on FinnKino</a>
                        </Col>
                    </Row>
                )
                setTimes([...setter]);
            }
        })
    }

    let dropdown = null;

    if (id != 0) {
        dropdown = (
            <Dropdown>
                <Dropdown.Toggle variant="dark" id="dropdown-basic">
                    {area.Name._text}
                </Dropdown.Toggle>
    
                <Dropdown.Menu>
                    {areas}
                </Dropdown.Menu>
            </Dropdown>
        ) 
    }

    useEffect(() => {getEventInfo()} ,[]);

    return (
        <div>
            <Row className="row-cols-auto">
                <Col className="fs-3"><b>Watch on FinnKino</b></Col>
            </Row>
            {dropdown}
            {times}
        </div>
    )
}