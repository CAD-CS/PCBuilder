import { useEffect, useState } from 'react'
import './Manufacturers.css'

const Manufacturers = () => {
    const [manufacturerQueryString, setManufacturerQueryString] = useState('/manufacturers');
    const [manufacturers, setManufacturers] = useState({});

    useEffect(() => {
        fetch(manufacturerQueryString)
            .then(response => response.json())
            .then(manufacturers => {
                console.log('fetch request for ' + manufacturerQueryString + ' successful.');
                //TODO: there could be some code to write here to ensure the manufacturers are set in the correct format
                setManufacturers(manufacturers);
            })
            .catch(error => {
                console.log('ERROR: fetch request for ' + manufacturerQueryString + ' unsuccessful.');
                setManufacturers({
                    1: {
                        name: 'fakename1',
                        country: 'fake'
                    },
                    2: {
                        name: 'fakename2',
                        country: 'fake'
                    },
                    3: {
                        name: 'fakename3',
                        country: 'fake'
                    },
                    4: {
                        name: 'fakename4',
                        country: 'fake'
                    },
                });
            })
    }, [manufacturerQueryString])

    function handleSubmit() {
        let newManufacturer = {
            name: document.getElementById('manufacturer-name').value,
            country: document.getElementById('manufacturer-country').value
        }

        let bodyJSON = JSON.stringify(newManufacturer);

        fetch('/manufacturer', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: bodyJSON,
          })
    }

    function handleSearch() {
        let newQuery = '/manufacturers';

        if (document.querySelector('input[id=country]').checked) {
            newQuery += '/country';
        }
        else {
            newQuery += '/name';
        }

        newQuery += `/:${document.getElementById('text-search').value}`;

        setManufacturerQueryString(newQuery);
    }

    return(
        <div className="page-view">
            <div id="existing-manufacturers">
                <h2>manufacturers:</h2>
                <pre>
                    <input type="radio" name='manufacturer-search' id="name" value='name'></input>
                    <label htmlFor="name">name      </label>
                    <input type="radio" name='manufacturer-search' id="country" value='country'></input>
                    <label htmlFor="country">country      </label>
                    <input type="text" id="text-search"></input>
                    <button onClick={handleSearch}>search</button>
                </pre>
                <ul id="manufacturer-list">
                    {Object.keys(manufacturers).map((key, i) => (
                        <li className="manufacturer-list-item" key={key}>
                            <pre><span>{manufacturers[key].name}</span>     <span>{manufacturers[key].country}</span></pre>
                        </li>
                    ))}
                </ul>
                
            </div>
            <div id="add-manufacturer">
                <h2>add manufacturer</h2>
                <label htmlFor="manufacturer-name">name</label><br></br>
                <input type='text' id='manufacturer-name'></input><br></br><br></br>
                <label htmlFor="manufacturer-country">country</label><br></br>
                <input type='text' id='manufacturer-country'></input><br></br>
                <button onClick={handleSubmit}>submit</button>
            </div>
        </div>
    );
};

    export default Manufacturers;