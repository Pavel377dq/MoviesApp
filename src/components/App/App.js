import MoviesList from '../MoviesList/MoviesList';
import "inter-ui/inter.css";
import { Component } from 'react';
import { Offline } from "react-detect-offline";

export default class App extends Component{



   render(){

      return <div>
               <Offline className="offline">Only shown offline (surprise!)</Offline>
               <MoviesList/>
            </div>
   }
}


