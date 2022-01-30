import logo from './logo.svg';
// import './App.css';
import Header from './components/Header'
import Editor from './components/Editor'

function App() {
  
  return (
    <div className="App">
      { <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        {/* // <p> */}
        {/* //   Edit <code>src/App.js</code> and save to reload. */}
        {/* // </p> */}

      </header> }
      <Header />
      <Editor />


    </div>


  );
}

export default App;