import React, {useState} from 'react'
import './App.css';
import EventsTable from './components/EventsTable';
import MapContainer from './components/GoogleMaps';

function App() {
  const [searchResults, setSearchResults] = useState([])

  return (
    <div className="App">
      <EventsTable searchResults={searchResults} setSearchResults={setSearchResults}/>
      <MapContainer searchResults={searchResults}/>
    </div>
  );
}

export default App;
