import MemeList from "./components/MemeList";
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
