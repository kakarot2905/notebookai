
import ImageUpload from "./components/ImageUpload";
import FileList from "./components/FileList";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from "./Pages/Home";
const App = () => {
  

  return (
   
      <>
      <Router>
        <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/get-summary" element={<ImageUpload />} />
          <Route path="/get-all-files" element={<FileList />} />
        </Routes>
      </Router>
      </>

   
  );
};

export default App;
