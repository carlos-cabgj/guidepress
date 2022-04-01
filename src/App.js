import './App.css';
import Home from './pages/index/Home.jsx';
import React, { useState, useEffect } from 'react';
import ResultsPanel from './components/panel/ResultsPanel.jsx';

function App() {

  const [results, setResults] = useState({
      modelTree          : {},
      modelTree2         : {},
      calcDataTree       : [],
      calcDataTree2      : [],
      countWordsUsedTree : 0,
      countWordsGenerated: 0,
      countWordsUsed     : 0,
      countDocuments     : 0,
      countFonts         : 0,
      plotDataPostTime   : [],
      plotDataWeek       : [],
      plotDataHours      : [],
      plotDataHours      : [],
      plotDataAll        : [],
  });

  return (
    <div className="App">
      <Home setResults={setResults}/>
      
      <div style={{ backgroundColor: 'rgb(207 229 227)'}}>
        <ResultsPanel 
          results={results}
        />
      </div>
    </div>
  );
}

export default App;
