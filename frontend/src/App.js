import MemeList from "./components/home/MemeList";
import { MemeProvider } from "./context/MemeContext";

function App() {
  return (
    <MemeProvider>
      <MemeList />
    </MemeProvider>
  );
}

export default App;
