import { Toaster } from 'react-hot-toast';
import { JokeGenerator } from './components/JokeGenerator';
import './App.css';

function App() {
  return (
    <>
      <JokeGenerator />
      <Toaster position="bottom-right" />
    </>
  );
}

export default App;