import MoviesList from '../MoviesList/MoviesList';
import "inter-ui/inter.css";
import { Component } from 'react';
import { Offline } from "react-detect-offline";
import { debounce } from "lodash";
import ApiService from "../../services/ApiService";

export default class App extends Component{

   MoviesApi = new ApiService();

   state = {
      moviesData: null,
      isLoadingAll: false,
      error: false
   }
   
   

   
    getMovie(evt) {
      
      debounce(()=>{this.MoviesApi.getResource(evt.target.value).then((serverData) => {
         this.setState({
           moviesData: serverData.results,
           isLoadingAll: true,//false?
           error: false
         });
         console.log('ok',serverData.results)
       }).catch((err)=> {
         this.setState({
           error: true,
           isLoadingAll: false
         })})}, 3500).call(this);

    }

   render(){
      const {moviesData,isLoadingAll,error}  = this.state;
      return <div>
               <Offline className="offline">Only shown offline (surprise!)</Offline>
               <input type='text' onChange={(evt) => this.getMovie(evt)}/>
               <MoviesList moviesData={moviesData} isLoadingAll={isLoadingAll} error={error}/>
            </div>
   }
}


