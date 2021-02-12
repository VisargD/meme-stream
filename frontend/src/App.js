import MemeList from "./components/home/MemeList";
import { MemeProvider } from "./context/MemeContext";
import axios from 'axios';

axios.defaults.baseUrl = "http://localhost:8081";

function App() {
  return (
    <MemeProvider>
      <MemeList />
    </MemeProvider>
  );
}

export default App;
