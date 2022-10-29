import './App.css';
import { db } from './firebase';
import { ref, get } from "firebase/database";

const dbRef = ref(db);

let dbVal = null;
let dbString =null;
get(dbRef).then((snapshot) => {
  if (snapshot.exists()) {
     dbVal = snapshot.val();
  dbString = JSON.stringify(dbVal,null,4)
    console.log(dbString);
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});


function App() {
  return (
    <div>
    <h1>BruinYelp 😋</h1>
    <h2>Eggert 🥺</h2>
    <h3>Here is some JSON data (😎):</h3>
      <pre>{dbString}</pre>
  </div>
  );
}

export default App;
