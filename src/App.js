import './App.css';
import {useEffect, useState} from "react";

const App = () => {

  const [list, setList] = useState()
  const [theater,setTheater] = useState()

  const movie = {
    "plot": "A group of bandits stage a brazen train hold-up, only to find a determined posse hot on their heels.",
    "genres": ["Short", "Western"],
    "runtime": { "$numberInt": "11" },
    "cast": ["A.C. Abadie", "Gilbert M. 'Broncho Billy' Anderson", "George Barnes", "Justus D. Barnes"],
  };


  const getMovies =  async () => {
    try {
      const results = await fetch('/.netlify/functions/get_movies')
      const data = await results.json()
      setList(data)
    } catch (error) {
      console.error(error)
    }
  }

  const getTheaters = async () => {
    try {
      const results = await fetch('/.netlify/functions/get_theaters')
      const data = await results.json()
      setTheater(data)
    } catch (error) {
      console.log(error)
    }
  }

  const postMovieEntry = async (data) => {
    try {
      const response = await fetch('/.netlify/functions/post_movies', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      console.log('Data saved:', result);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const deleteMovieEntry = async () => {
    try {
      const response = await fetch('/.netlify/functions/delete_movie', {
        method: 'POST',
        body: JSON.stringify({
          _id: '573a1390f29313caabcd42e8'
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      console.log('Data deleted:', result);
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  useEffect(() => {
    Promise.all([getMovies(), getTheaters()]).then(() => {
      const controller = new AbortController();
      controller.abort();
    });
  }, []);


  return (
    <div className="App">
      <header className="App-header">
        <h1>Available Movies: </h1>
        {list?.map((val, index) => {
          return (
            <div key={index}>
              {val.title}
            </div>
          )
        })}
        <h1>Available Theaters in: </h1>
        {theater?.map((val, index) => {
          return (
            <div key={index}>
              {val.location.address.city}
            </div>
          )
        })}
        <button style={{marginTop: '2%'}} onClick={() => postMovieEntry(movie)}>Post</button>
        <button style={{marginTop: '2%'}} onClick={deleteMovieEntry}>Delete</button>
      </header>
    </div>
  );
}

export default App;
