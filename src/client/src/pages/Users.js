import { useState, useEffect } from 'react'
import './Users.css'

const Users = () => {
  const [userQueryString, setUserQueryString] = useState('/Users/postsNum/0');
  const [users, setUsers] = useState({});

  useEffect(() => {
    fetch(userQueryString)
      .then(response => response.json())
      .then(users => {
        if (users.error !== undefined) {
          throw new Error(users.error);
        }
        console.log('query for ' + userQueryString + ' successful.');
        console.log(users);
        setUsers(users)
      })
      .catch(error => {
        alert(error);
        console.log('query for ' + userQueryString + ' unsuccessful.');
      })
  }, [userQueryString])

  function handleSubmit() {
    setUserQueryString(`/Users/postsNum/${document.getElementById('numReviews').value}`);
  }

  return(
    <div className="page-view">
        <div id="existing-user">
          <h2>view accounts with more than x reviews</h2>
          <input type='number' id='numReviews'></input>
          <label for='numReviews'>number of reviews</label>
          <button onClick={handleSubmit}>submit</button>
          <ul id="user-list">
            {Object.keys(users).map((key, i) => {
              let user = users[key];
              let display = user.fname + ' ' + user.lname + ' id:' + user.uid;
              return (<li className='user-list-item'>{display}</li>)
            })
            }
          </ul>
        </div>
    </div>
);
  };
  
  export default Users;