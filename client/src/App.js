import './App.css';
import { Route, Switch } from "react-router-dom";
import Welcome from './components/Welcome'
import Home from './components/Home'
import ActivityForm from "./components/ActivityForm";
import Country from "./components/Country";
import NotFound from "./components/NotFound";
import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();

axios.defaults.baseURL = process.env.REACT_APP_API;

function App() {
  return (
    <div>
        <Switch>
            <Route exact path={'/'}><Welcome/></Route>
            <Route path={'/home'}><Home/></Route>
            <Route path={'/country/:countryId'} render={({match})=><Country match={match}/>}/>
            <Route path={'/activity'}><ActivityForm/></Route>
            <Route path={'*'}><NotFound/></Route>
        </Switch>
    </div>
  );
}

export default App;
