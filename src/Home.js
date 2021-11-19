import paint from "./paint.png";
import "./App.css";

function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={paint} className="App-logo" alt="logo" />
        <a href="./Draw">Start Drawing!</a>
      </header>
    </div>
  );
}

export default Home;
