import { useState, useEffect } from 'react'
import './Reviews.css'

const Reviews = () => {
    const [reviewQueryString, setReviewQueryString] = useState('/reviews');
    const [reviews, setReviews] = useState({});

    useEffect(() => {
        fetch(reviewQueryString)
            .then(response => response.json())
            .then(reviews => {
                console.log('fetch request for ' + reviewQueryString + ' successful.');
                //TODO: there could be some code to write here to ensure the reviews are in the correct format
                setReviews(reviews);
            })
            .catch(error => {
                console.log('ERROR: fetch request for ' + reviewQueryString + ' unsuccessful.');
                setReviews({
                    rid1: {
                        title: 'fake review 1',
                        user: 'fakeEmail@email.com',
                        build: 'fakeBuildName1',
                        body: 'this build was good, I like it, this is a fake review'
                    },
                    rid2: {
                        title: 'fake review 2',
                        user: 'fakeEmail@email.com',
                        build: 'fakeBuildName2',
                        body: 'this build was good, I like it, this is a fake review'
                    },
                    rid3: {
                        title: 'fake review 3',
                        user: 'fakeEmail@email.com',
                        build: 'fakeBuildName3',
                        body: 'this build was good, I like it, this is a fake review'
                    },
                    rid4: {
                        title: 'fake review 4',
                        user: 'fakeEmail@email.com',
                        build: 'fakeBuildNam4',
                        body: 'this build was good, I like it, this is a fake review'
                    },
                    rid5: {
                        title: 'fake review 5',
                        user: 'fakeEmail@email.com',
                        build: 'fakeBuildName5',
                        body: 'this build was good, I like it, this is a fake review'
                    },
                })
            })
    }, [reviewQueryString])

    function handleSearch() {
        let newQuery = '/reviews';
        if (document.querySelector('input[id=title-search]').checked) {
            newQuery += '/title'
        }
        else {
            newQuery += '/email'
        }

        newQuery += `/:${document.getElementById('text-search').value}`

        setReviewQueryString(newQuery);
    }

    function handleSubmit() {
        let newReview = {
            title: document.getElementById('review-title').value,
            authorEmail: document.getElementById('review-author').value,
            buildName: document.getElementById('review-build').value,
            body: document.getElementById('review-body').value
        }

        let bodyJSON = JSON.stringify(newReview);

        fetch('/review', {
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
            <div id="review-search">
                <pre>
                    <input type='radio' name='review-search' id='title-search' value='title'></input>
                    <label htmlFor="title-search">title     </label>
                    <input type='radio' name='review-search' id='user-search' value='user'></input>
                    <label htmlFor="user-search">user-email     </label>
                    <input type="text" id='text-search'></input>
                    <button onClick={handleSearch}>search</button>
                </pre>
            </div>
            <div id="existing-reviews">
                <ul id="review-list">
                    {Object.keys(reviews).map((rid, i) => (
                        <li className='component-list-item' key={rid}>
                            <Review review={reviews[rid]} />
                        </li>   
                    ))}
                </ul>
            </div>
            <div id="add-review">
                <h2>write review</h2>
                <label htmlFor='review-title'>title</label><br></br>
                <input type='text' id='review-title'></input><br></br><br></br>
                <label htmlFor='review-author'>author email</label><br></br>
                <input type='text' id='review-author'></input><br></br><br></br>
                <label htmlFor='review-build'>build</label><br></br>
                <input type='text' id='review-build'></input><br></br><br></br>
                <label htmlFor='review-body'>body</label><br></br>
                <input type='text' id='review-body'></input><br></br><br></br>
                <button onClick={handleSubmit}>submit</button>

            </div>
        </div>
    );
};

const Review = (props) => {
    let title = props.review.title;
    let user = props.review.user;
    let build = props.review.build;
    let body = props.review.body;

    return (
        <div className="review">
            <h3>{title}</h3>
            <h5>by: {user}</h5>
            <h5>on: {build}</h5>
            <p className="review-body">{body}</p>
        </div>
    )
}
    
export default Reviews;