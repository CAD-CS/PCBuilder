import { useState, useEffect } from 'react'
import './Tests.css'

const Tests = () => {
  const [games, setGames] = useState({});
  const [builds, setBuilds] = useState({});
  const [tests, setTests] = useState({});

  useEffect(() => {
    fetch('/games')
    .then(response => response.json())
    .then(games => {
        console.log('fetch request for /games successful.');
        //TODO: there could be some code to write here to ensure the manufacturers are set in the correct format
        setGames(games);
    })
    .catch(error => {
        console.log('ERROR: fetch request for /games unsuccessful.');
        setGames({
          0: {name: 'fakeName1', 
              developer: 'fakeDeveloper1', 
              releaseDate: 'fakeDate1'},
          1: {name: 'fakeName2', 
              developer: 'fakeDeveloper2', 
              releaseDate: 'fakeDate2'},
          2: {name: 'fakeName3', 
              developer: 'fakeDeveloper3', 
              releaseDate: 'fakeDate3'},
          3: {name: 'fakeName4', 
              developer: 'fakeDeveloper4', 
              releaseDate: 'fakeDate4'},
          4: {name: 'fakeName5', 
              developer: 'fakeDeveloper5', 
              releaseDate: 'fakeDate5'},
        });
    })
  }, [])

  useEffect(() => {
    fetch('/builds')
        .then(response => response.json())
        .then(builds => {
            console.log('fetch request for /builds successful.');
            //TODO: there could be some code to write here to ensure the builds are set in the correct format
            setBuilds(builds);
        })
        .catch((error) => {
            console.log('ERROR: fetch request for /builds unsuccessful.');
            setBuilds({
                bid1: 'noBuild1',
                bid2: 'noBuild2',
                bid3: 'noBuild3',
                bid4: 'noBuild4',
                bid5: 'noBuild5' 
            });
        })
}, []);
  
  useEffect(() => {
    fetch('/tests')
    .then(response => response.json())
    .then(tests => {
        console.log('fetch request for /tests successful.');
        //TODO: there could be some code to write here to ensure the manufacturers are set in the correct format
        setTests(tests);
    })
    .catch(error => {
        console.log('ERROR: fetch request for /tests unsuccessful.');
        setTests({
          rid1: {level: 'low', score: '1000', game: 'fakeGame1', build: 'fakeBuild1', passed: true},
          rid2: {level: 'avg', score: '1500', game: 'fakeGame2', build: 'fakeBuild2', passed: false},
          rid3: {level: 'high', score: '2000', game: 'fakeGame3', build: 'fakeBuild3', passed: false},
          rid4: {level: 'high', score: '1750', game: 'fakeGame4', build: 'fakeBuild4', passed: true},
          rid5: {level: 'avg', score: '1750', game: 'fakeGame5', build: 'fakeBuild5', passed: true}
        });
    })
  }, [])

  function handleGameSubmit() {
    let newGame = {
      title: document.getElementById('game-name').value,
      developer: document.getElementById('game-developer').value,
      releaseDate: document.getElementById('game-release').value
    }

    let bodyJSON = JSON.stringify(newGame);

    fetch('/game', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: bodyJSON,
    })
  }

  function handleAddTest() {
    let newReq = {
      game: document.getElementById('select-game').value,
      build: document.getElementById('select-build').value,
      score: document.getElementById('req-score').value,
      passed: document.getElementById('passed').checked
    }

    if (document.querySelector('input[id="req-min"]').checked) {
      newReq['level'] = 'min';
    }
    else if(document.querySelector('input[id="req-avg"]').checked) {
      newReq['level'] = 'avg';
    }
    else {
      newReq['level'] = 'max';
    }

    let bodyJSON = JSON.stringify(newReq);

    fetch('/test', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: bodyJSON,
    })
  }

  return(
    <div className="page-view">
        <div id='tests'>
          <div id='add-test'>
            <pre>
              <select id="select-game">
                <option defaultValue="" disabled hidden>game </option>
                {Object.keys(games).map((key, i) => (
                    <option value={games[key].name}>{games[key].name}</option>
                ))}
              </select><br></br>
              <select id="select-build">
                <option defaultValue="" disabled hidden>build </option>
                {Object.keys(builds).map((key, i) => (
                    <option value={key}>{builds[key]}</option>
                ))}
              </select><br></br>
              <label htmlFor='req-min'>min:</label>
              <input type="radio" name='req-type' id="req-min" value='min'></input>
              <label htmlFor='req-avg'>avg:</label>
              <input type="radio" name='req-type' id="req-avg" value='avg'></input>
              <label htmlFor='req-max'>max:</label>
              <input type="radio" name='req-type' id="req-max" value='max'></input><br></br>
              <label htmlFor='req-score'>   score:</label>
              <input type='number' id='req-score'></input><br></br>
              <label htmlFor='passed'>passed:</label>   
              <input type='checkbox' id='passed'></input><br></br>
              <button onClick={handleAddTest}>add test</button>
            </pre>
          </div>
          <div id='existing-tests'>
            <ul id='tests-list'>
              {Object.keys(tests).map((key, i) => {
                let test = tests[key];
                let build = test.build;
                let game = test.game;
                let level = test.level;
                let score = test.score;
                let passed = (test.passed === true) ? 'passed' : 'failed';
                return (<li className="test-list-item" key={key}><pre><span>{build}  {game}  {level}   {score}  {passed}</span></pre></li>)
              })}
            </ul>
          </div>
        </div>
        <div id='games'>
          <div id='add-game'>
            <pre>
              <br></br>
              <label htmlFor='game-name'>title:</label>
              <input type="text" id="game-name"></input>
              <label htmlFor='game-developer'>   developer:</label>
              <input type='text' id='game-developer'></input><br></br>
              <label htmlFor='game-release'>release date:</label>
              <input type='date' id='game-release'></input>
              <button onClick={handleGameSubmit}>submit</button>
            </pre>
          </div>
          <ul id='games-list'>
            {Object.keys(games).map((key, i) => {
              let game = games[key];
              let name = game.name;
              let developer = game.developer;
              let releaseDate = game.releaseDate;
              return (<li className="games-list-item" key={key}><pre><span>  {name}        created by: {developer}        released {releaseDate}</span></pre></li>)
            })}
          </ul>
        </div>
    </div>
  );
};
  
  export default Tests;