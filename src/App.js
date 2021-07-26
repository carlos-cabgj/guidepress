import './App.css';
import Home from './pages/index/Home.jsx';

import Dexie from "dexie";

function App() {
  const db = new Dexie('GuidePress');

  // console.log(1)
  db.version(1).stores({
    friends: '++id, name, age'
  });
  // db.version(1);

  setTimeout(() => db.friends.add({name: "Joe", age: 78}), 1000);

  return (
    <div className="App">
      <Home/>
    </div>
  );
}

export default App;
