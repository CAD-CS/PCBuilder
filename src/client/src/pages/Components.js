import { useEffect, useState } from 'react'
import './Components.css'

const Components = () => {
    const [componentQueryString, setComponentQueryString] = useState('/components/projection/cid,component_name,manufacturer_name,cost,speed,cores,capacity');
    const [components, setComponents] = useState({});
    const [manufacturerByPrice, setManufacturerByPrice] = useState({});
    const [manufacturerMinComponent, setManufacturerMinComponent] = useState({})
    const [componentsDropdown, setComponentsDropdown] = useState([]);
    const [queryAgain, setQueryAgain] = useState(false);

    useEffect(() => {
        fetch(componentQueryString)
            .then(response => response.json())
            .then(components => {
                if (components.error !== undefined) {
                    throw new Error(components.error);
                }
                console.log('fetch request for ' + componentQueryString + ' successful.');
                setComponents(components);
            })
            .catch((error) => {
                alert(error);
                console.log('ERROR: fetch request for' + componentQueryString + ' unsuccessful.')
            })
    }, [componentQueryString, queryAgain])

    useEffect(() => {
        fetch('/components/projection/cid,component_name,manufacturer_name')
            .then(response => response.json())
            .then(components => {
                if (components.error !== undefined) {
                    throw new Error(components.error);
                }
                console.log('fetch request for /components/projection/cid,component_name,manufacturer_name successful');
                setComponentsDropdown(components);
            })
            .catch(error => {
                alert(error);
                console.log('ERROR: fetch request for /components/projection/cid,component_name,manufacturer_name unsuccessful');
            })
    }, [queryAgain])

    const [newCompType, setNewCompType] = useState(null);

    function handleNewCompType() {
        document.getElementById("speed").value = '';
        document.getElementById("cores").value = '';
        document.getElementById("capacity").value = '';

        if(document.querySelector('input[id="CPU"]').checked) {
            setNewCompType('CPU');
        }
        else if (document.querySelector('input[id="GPU"]').checked) {
            setNewCompType('GPU');
        }
        else if (document.querySelector('input[id="RAM"]').checked) {
            setNewCompType('RAM');
        }
        else {
            setNewCompType(null);
        }
    }

    function handleSubmit() {
        let newComponent = {
            cid: document.getElementById('component-cid').value,
            name: document.getElementById('component-name').value,
            manufacturer: document.getElementById('component-manufacturer').value,
            cost: Number(document.getElementById('component-cost').value),
            type: newCompType
        }

        switch (newCompType) {
            case 'CPU':
                newComponent['speed'] = Number(document.getElementById("speed").value);
                break;
            case 'GPU':
                newComponent['cores'] = Number(document.getElementById("cores").value);
                break;
            case 'RAM' :
                newComponent['capacity'] = Number(document.getElementById("capacity").value);
                break;
            default:
                alert('no component type selected!');
                return;
        }

        let bodyJSON = JSON.stringify(newComponent);
        
        fetch('/component', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: bodyJSON,
          })
        .then(response => response.json())
        .then(data => {
            if(data.message) {
                alert(data.message);
            }
            else {
                alert(data.error);
            }
            setQueryAgain(!queryAgain);
        })
    }

    function handleUpdate() {
        let updateComponent = {
            component_name: document.getElementById('update-component-name').value,
            manufacturer_name: document.getElementById('update-component-manufacturer').value,
            cost: Number(document.getElementById('update-component-cost').value),
        }

        let bodyJSON = JSON.stringify(updateComponent);

        fetch(`/updateComponent/cid/${document.getElementById('update-select-component').value}`, {
            method: 'PUT',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: bodyJSON,
          })
        .then(response => response.json())
        .then(data => {
            if(data.message) {
                alert(data.message);
            }
            else {
                alert(data.error);
            }
            setQueryAgain(!queryAgain);
            setManufacturerByPrice({});
            setManufacturerMinComponent({});
        })
    }

    function handleDelete() {
        fetch(`/deleteComponent/cid/${document.getElementById('update-select-component').value}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if(data.message) {
                alert(data.message);
            }
            else {
                alert(data.error);
            }
            setQueryAgain(!queryAgain);
            setManufacturerByPrice({});
            setManufacturerMinComponent({});
        })
    }

    function handleSearch() {
        let component_name = document.getElementById('check_name').checked ? ',component_name' : '';
        let manufacturer_name = document.getElementById('check_manufacturer').checked ? ',manufacturer_name' : '';
        let cost = document.getElementById('check_cost').checked ? ',cost' : '';

        let projection = '/projection/cid,' + `${component_name}${manufacturer_name}${cost}`.substring(1);
        console.log(projection);
        setComponentQueryString(`/components${projection}`);
    }

    function selectionSearch() {
        setComponentQueryString(`/components/component_name/${document.getElementById('text-search').value}`);
    }

    function handleComponentCostPerManufacturer() {
        fetch('/componentCostPerManufacturer')
            .then(response => response.json())
            .then(manufacturers => {
                if (manufacturers.error !== undefined) {
                    throw new Error(manufacturers.error);
                }
                console.log('request to /componentCostPerManufacturer successful.');
                setManufacturerByPrice(manufacturers);
            })
            .catch(error => {
                console.log('request to /componentCostPerManufacturer unsuccessful.');
                alert(error);
            })
    }

    function handleMinComponent() {
        fetch('/minComponentPricePerManufacturer')
            .then(response => response.json())
            .then(manufacturers => {
                if (manufacturers.error !== undefined) {
                    throw new Error(manufacturers.error);
                }
                console.log('request to /minComponentPricePerManufacturer successful.');
                setManufacturerMinComponent(manufacturers);
            })
            .catch(error => {
                console.log('request to /minComponentPricePerManufacturer unsuccessful.');
                alert(error);
            })
    }

    return(
        <div className="page-view">
            <div id="existing-components">
                <h2>Components:</h2>
                <pre>
                    <input type="text" id="text-search"></input>
                    <label htmlFor="text-search"> component name </label>
                    <button onClick={selectionSearch}>search</button><br></br>
                    <input type="checkbox" id="check_name" value="name"></input>
                    <label htmlFor='check_name'>name</label>
                    <input type="checkbox" id="check_manufacturer" value="manufacturer"></input>
                    <label htmlFor='check_manufacturer'>manufacturer</label>
                    <input type="checkbox" id="check_cost" value="cost"></input>
                    <label htmlFor='check_cost'>cost</label>
                    <button onClick={handleSearch}>search</button><br></br>
                </pre>
                <ul id="component-list">
                    {Object.keys(components).map((index, i) => {
                        //get values from component object
                        let component = components[index];
                        let cid = component.cid !== undefined ? component.cid.trim() : '';
                        let name = component.component_name !== undefined ? component.component_name.trim() : '';
                        let manufacturer = component.manufacturer_name !== undefined ? component.manufacturer_name.trim() : '';
                        let cost = component.cost;

                        //display a list item with the component information for each component
                        return (
                        <li className="component-list-item" key={cid}>
                            <pre><span>{cid}</span>    <span>{name}</span>    <span>{manufacturer}</span>     <span>{cost}</span></pre>
                        </li>)
                    })}
                    
                </ul>
            </div>
            <div id="manufacturersAvgPrice">
                <h2>average component price per manufacturer:</h2>
                <button onClick={handleComponentCostPerManufacturer}>search</button>
                <ul id='manufacturer-list'>
                    {Object.keys(manufacturerByPrice).map((key, i) => {
                        let man = manufacturerByPrice[key];
                        let display = man.manufacturer_name + ' ' + Math.round(man.avg) + '$';
                        return (<li className='manufacturer-list-item'>{display}</li>)
                    })}
                </ul>
            </div>
            <div id='manufacturersMinComponent'>
                <h2>cheapest component per manufacturer:</h2>
                <button onClick={handleMinComponent}>search</button>
                <ul id='manufacturer-min-list'>
                    {Object.keys(manufacturerMinComponent).map((key, i) => {
                        let man = manufacturerMinComponent[key];
                        let display = man.manufacturer_name + ' ' + man.component_name + ' ' + man.cost + '$';
                        return (<li className='manufacturer-min-list-item'>{display}</li>)
                    })}
                </ul>
            </div>
            <div id="add-component">
                <h2>add component:</h2>
                <label htmlFor="component-cid">id</label> <br></br>
                <input type="text" id="component-cid"></input><br></br><br></br>
                <label htmlFor="component-name">name</label> <br></br>
                <input type="text" id="component-name"></input><br></br><br></br>
                <label htmlFor="component-manufacturer">manufacturer</label><br></br>
                <input type='text' id="component-manufacturer"></input><br></br><br></br>
                <label htmlFor="component-cost">cost</label><br></br>
                <input type="number" id="component-cost"></input><br></br><br></br>
                <label>type</label><br></br>
                <pre>
                    <input type="radio" name="component-type" id="CPU" value="CPU" onChange={handleNewCompType}></input>
                    <label htmlFor="CPU">CPU    </label>
                    <input type="radio" name="component-type" id="GPU" value="GPU" onChange={handleNewCompType}></input>
                    <label htmlFor="GPU">GPU    </label>
                    <input type="radio" name="component-type" id="RAM" value="RAM" onChange={handleNewCompType}></input>
                    <label htmlFor="RAM">RAM</label>
                </pre>
                <label htmlFor="speed">speed Ghz</label><br></br>
                <input type="number" id="speed" disabled={newCompType !== 'CPU'}></input><br></br>
                <label htmlFor="cores">cores</label><br></br>
                <input type="number" id="cores" disabled={newCompType !== 'GPU'}></input><br></br>
                <label htmlFor="capacity">capacity GB</label><br></br>
                <input type="number" id="capacity" disabled={newCompType !== 'RAM'}></input><br></br><br></br>
                <button onClick={handleSubmit}>submit</button>
            </div>
            <div id="update-component">
            <h2>update or delete:</h2>
                <select id='update-select-component'>
                <option defaultValue="" >select a component</option>
                {Object.keys(componentsDropdown).map((key, i) => {
                    let components = componentsDropdown[key];
                    let cid = components.cid;
                    let option = components.manufacturer_name.trim() + '   ' + components.component_name.trim();
                    return (<option value={cid}>{option}</option>)
                })}
                </select><br></br><br></br>
                <label htmlFor="update-component-name">name</label> <br></br>
                <input type="text" id="update-component-name"></input><br></br><br></br>
                <label htmlFor="update-component-manufacturer">manufacturer</label><br></br>
                <input type='text' id="update-component-manufacturer"></input><br></br><br></br>
                <label htmlFor="update-component-cost">cost</label><br></br>
                <input type="number" id="update-component-cost"></input><br></br><br></br>
                <button onClick={handleUpdate}>update</button><button onClick={handleDelete}>delete</button>
            </div>
        </div>
    );
  };
  
  export default Components;