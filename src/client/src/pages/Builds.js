import { useEffect, useState } from 'react'
import './Builds.css'

const Builds = () => {
    const [buildsPassing, setBuildsPassing] = useState([]);
    const [components, setComponents] = useState({});
    const [games, setGames] = useState({});
    const [builds, setBuilds] = useState({});

    useEffect(() => {
        fetch('/games')
            .then(response => response.json())
            .then(games => {
                if (games.error !== undefined) {
                    throw new Error(games.error);
                } 
                console.log('fetch request for /games successful.');
                //TODO: there could be some code to write here to ensure the builds are set in the correct format
                setGames(games);
            })
            .catch((error) => {
                alert(error);
                console.log('ERROR: fetch request for /games unsuccessful.');
            })
    }, []);

    useEffect(() => {
        fetch('/builds')
            .then(response => response.json())
            .then(builds => {
                if (builds.error !== undefined) {
                    throw new Error(builds.error);
                } 
                console.log('fetch request for /builds successful.');
                //TODO: there could be some code to write here to ensure the builds are set in the correct format
                setBuilds(builds);
            })
            .catch((error) => {
                alert(error);
                console.log('ERROR: fetch request for /builds unsuccessful.');
            })
    }, []);

    function handleSearch() {
        fetch(`/buildsPassingAllTests/${document.getElementById('select-game').value}`)
        .then(response => response.json())
        .then(resBuilds => {
            if (resBuilds.error !== undefined) {
                throw new Error(resBuilds.error);
            } 
            console.log('fetch request for /builds successful.');
            setBuildsPassing(resBuilds);
        })
        .catch((error) => {
            alert(error);
            console.log('ERROR: fetch request for /builds unsuccessful.');
        })
    }

    function handleBuildSearch() {
        fetch(`/builds/components/${document.getElementById('select-build').value}`)
            .then(response => response.json())
            .then(components => {
                if (components.error !== undefined) {
                    throw new Error(components.error);
                }

                console.log(`fetch request for /builds/components/${document.getElementById('select-build').value} successful.`);
                setComponents(components);
            })
            .catch(error => {
                alert(error);
                console.log(`fetch request for /builds/components/${document.getElementById('select-build').value} unsuccessful.`);
                setComponents({});
            })
    }

    return (
        <div className="page-view">
            <div id="existing-builds">
                <h2>Builds passing all tests with a certain game:</h2>
                <select id="select-game">
                    <option defaultValue="select game" disabled></option>
                    {Object.keys(games).map((key, i) => (
                        <option value={games[key].game_name}>{games[key].game_name}</option>
                    ))}
                </select>
                <button onClick={handleSearch}>search</button>
                <ul id="build-list">
                    {buildsPassing.map((build) => (
                        <Build bid={build.bid} bname={build.name} />
                    ))}
                </ul>
            </div>
            <div id="components-in-build">
                <h2>components in build:</h2>
                <select id="select-build">
                    <option defaultValue="select build" disabled></option>
                    {Object.keys(builds).map((key, i) => (
                        <option value={builds[key].name}>{builds[key].name}</option>
                    ))}
                </select>
                <button onClick={handleBuildSearch}>search</button>
                <ul id="component-list">
                    {Object.keys(components).map((key, i) => {
                        let component = components[key];
                        let display = component.component_name + ' ' + component.cost + ' ' + component.manufacturer_name
                        return (<li className='component-list-item'>{display}</li>)
                    })}
                </ul>
            </div>
        </div>
    );
};

const Build = (props) => {
    
    return (
    <li className='build-list-item' key={props.bid}>
        <div className='build'>
            {props.bname}
        </div>
    </li>
    )
}
  
  export default Builds;