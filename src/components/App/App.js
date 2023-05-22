import MoviesList from '../MoviesList/MoviesList';
import "inter-ui/inter.css";
import { Component } from 'react';
import { Offline } from "react-detect-offline";
import { debounce } from "lodash";
import ApiService from "../../services/ApiService";
import {Pagination} from "antd"

export default class App extends Component{

   MoviesApi = new ApiService();

    

    state = {
      moviesData: null,
      isLoadingAll: false,
      error: false,
      totalItems: 0,
      currentPage: 1,
      movieName: ''
   }
   
   getMovies = async (keyWord, page = 1) => {
    
    this.MoviesApi.getResource(keyWord,page).then((serverData) => {
      this.setState({
        movieName: keyWord,
        moviesData: serverData.results,
        totalItems: serverData.total_results,
        currentPage: serverData.page,
        isLoadingAll: true,//false?
        error: false
      });
    }).catch((err)=> {
      this.setState({
        error: true,
        isLoadingAll: false,
        moviesData: null
      })})
    
  };
   
   deb = debounce(keyWord => {
   this.getMovies(keyWord)
  }, 1000);

 

  changePage = (page) => {
    const { movieName } = this.state;

    this.getMovies(movieName, page);
  };
   
   

   render(){
      const {moviesData,isLoadingAll,error,currentPage,totalItems}  = this.state;
      return <div>
               <Offline className="offline">Only shown offline (surprise!)</Offline>
               <input type='text' onChange={event =>this.deb(event.target.value)}/>
               <MoviesList moviesData={moviesData} isLoadingAll={isLoadingAll} currentPage={currentPage} error={error}/>
               <Pagination
            current={currentPage}
            total={totalItems}
            pageSize={20}
            onChange={this.changePage}
            hideOnSinglePage
            showSizeChanger={false}
            responsive
            className="pagination"
          />
            </div>
   }
}


