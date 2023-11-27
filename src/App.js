import React, {useState, useEffect } from 'react';
import './App.css';
import simpsonsDonut from './simpsonsDonut.jpg'

// The Donut Component
function Donut({ Name, Description, Price }) {
    return (
        <div className="donut">
            <h3>{Name}</h3>
            <img src={simpsonsDonut} alt="This is a donut" class="donut-image"></img>
            <p>{Description}</p>
            <p>Price of One Donut: ${Price}</p>
        </div>
    );
}

// App component where we fetch the data and render the donut component
function App() {
    // State hook to store the list of donuts
    const [donuts, donutSetter] = useState([]);

    useEffect(() => {
        //Fetch the data from the API
        fetch('http://localhost/projects/project3/main.php')
            // Parse JSON response
            .then(response => response.json())
            // Update donut state with fetched data
            .then(data => donutSetter(data))
            .catch(error => console.error('Error fetching donuts:', error));
    }, []);

    return (
        <div>
        <header>
            <h1>Doughnut Despair</h1>    
        </header>
        
        <main>
            {donuts.map((donut) => (
                <Donut key={donut.ID} Name={donut.Name} Description={donut.Description} Price={donut.Price} />
            ))}
        </main>
        </div>
    );
}

export default App;
