import MemeList from "./components/home/MemeList";
import { MemeProvider } from "./context/MemeContext";

function App() {
  return (
    <MemeProvider>
      <div className="App">
        <MemeList />
      </div>
    </MemeProvider>
  );
}

export default App;
