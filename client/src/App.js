import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { AppContextProvider } from './context/appContext/AppContext';
import Signin from './pages/signin/Signin';
import Signup from './pages/signup/Signup';
import Topbar from './components/topbar/Topbar';
import UserDashboard from './pages/userdashboard/UserDashboard';
import PrivateRoute from './components/routing/PrivateRoute'
import Homescreen from './pages/home/Homescreen';

function App() {
  return (
    <AppContextProvider>
      <div className="App">
        <BrowserRouter>
          <Topbar />
          <div className="appWrapper">
            <Switch>
              <Route exact path="/" component={Homescreen} />
              <Route exact path="/signin" component={Signin} />
              <Route exact path="/signup" component={Signup} />
              <PrivateRoute exact path="/userdashboard" component={UserDashboard} />
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    </AppContextProvider>
  );
}

export default App;
