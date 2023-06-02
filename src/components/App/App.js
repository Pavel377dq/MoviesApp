/* eslint-disable no-unused-expressions */


import 'inter-ui/inter.css';
import { Component } from 'react';
import { Offline } from 'react-detect-offline';
import { debounce } from 'lodash';
import { Pagination , Spin } from 'antd';

import MoviesList from '../MoviesList/MoviesList';
import ApiService from '../../services/ApiService';
import './App.css';
import TopBar from '../TopBar/TopBar';
import { Provider } from '../../services/contextApi';

export default class App extends Component {

  genres = null;

  deb = debounce((keyWord) => {
    this.getMovies(keyWord);
   }, 1000);

constructor(){
  super();
  this.MoviesApi = new ApiService(); 
  this.state = {
    pageApp: 'Search',
    moviesData: null,
    isLoadingAll: false,
    spin: true,
    error: null,
    totalItems: 0,
    currentPage: 1,
    movieName: '',
    isOpenSession: false,
    ratesMovies: [],
   };
}




 componentDidMount() {

  this.openGuestSession();
  this.getMovies('Road');
  this.setState({ movieName: 'Road' });
  this.MoviesApi.getGenre().then((data) => {
   this.genres = data.genres;
  });
 }

 

 componentDidUpdate(prevProps, prevState) {

  const { isOpenSession, pageApp, movieName, currentPage } = this.state;
  const { isOpenSession: prevIsOpenSession, pageApp: prevPageApp } = prevState;

  if (isOpenSession !== prevIsOpenSession && isOpenSession) {
   this.getMovies(movieName, currentPage);
  }
  if (pageApp !== prevPageApp && isOpenSession) {
   this.getMovies(movieName, currentPage);
  }
 }


 rateMovie = (filmId, rate) => {
  this.MoviesApi.putRateMovie(filmId, rate).then(() => {
   this.setState(({ moviesData, ratesMovies }) => {
    const newMovieList = moviesData.map((movie) => (movie.id === filmId ? { ...movie, rating: rate } : { ...movie }));

    const newRatesMovies = [...ratesMovies];
    newRatesMovies.push(filmId);

    return { moviesData: newMovieList, ratesMovies: newRatesMovies };
   });
  });
 };


 openGuestSession = async () => {
  try {
   this.setState({
    isLoadingAll: true,
   });
   await this.MoviesApi.openGuestSession();
   this.setState({
    error: null,
    isOpenSession: true,
   });
  } catch (err) {
   this.setState({
    error: err,
    isOpenSession: false,
    isLoadingAll: false,
   });
  }
 };

 getMovies = async (keyWord, page = 1) => {
  const { pageApp } = this.state;

  setTimeout(() => this.setState({ isLoadingAll: true }), 0);
  let pageNumber = 1;
  let ratedMovies = await this.MoviesApi.getAllRatedMovies(pageNumber);
  let totalRes = ratedMovies.total_results;
  const allRatedMovies = [];
  while (totalRes > 0) {
   totalRes -= 20;
   allRatedMovies.push(...ratedMovies.results);
   pageNumber+=1;
   // eslint-disable-next-line no-await-in-loop
   ratedMovies = await this.MoviesApi.getAllRatedMovies(pageNumber);
  }

  setTimeout(() => {
  
   pageApp === 'Search' ? this.MoviesApi.getResource(keyWord, page)
       .then((serverData) => {
        
         const movies = allRatedMovies.length !== 0
          ? serverData.results.map((movie) => {
             for (let i = 0; i < allRatedMovies.length; i+=1) {
              if (allRatedMovies[i].id === movie.id) {

               // eslint-disable-next-line no-param-reassign
               movie.rating = allRatedMovies[i].rating;
              }
             }

             return movie;
            })
          : serverData.results;

        
        this.setState({
         movieName: keyWord,
         moviesData: movies,
         totalItems: serverData.total_results,
         currentPage: serverData.page,
         isLoadingAll: false, 
         error: false,
         spin: false,
        });
       })
       .catch((err) => {
        this.setState({
         error: err,
         isLoadingAll: false,
         moviesData: null,
         spin: false,
        });
       })
    : this.MoviesApi.getRatedMovies(page)
       .then((serverData) => {

        this.setState({
         movieName: keyWord,
         moviesData: serverData.results,
         totalItems: serverData.total_results,
         currentPage: serverData.page,
         isLoadingAll: false, // false?
         error: false,
         spin: false,
        });
       })
       .catch((err) => {
        this.setState({
         error: err,
         isLoadingAll: false,
         moviesData: null,
         spin: false,
        });
       });
  }, 1500);
 };


 changePage = (page) => {
  const { movieName } = this.state;

  this.getMovies(movieName, page);
 };

 changePageApp = (pageApp) => {
  this.setState({
   pageApp,
  });
 };

 
 render() {
  const { moviesData, isLoadingAll, error, currentPage, totalItems, pageApp, spin } = this.state;
  return (
   <Provider value={this.genres}>
    <div className="main-wrap">
     <div>
      <Offline className="offline">Only shown offline (surprise!)</Offline>
      <TopBar pageApp={pageApp} changePageApp={this.changePageApp} />
      {pageApp === 'Search' && (
      
       <input
        placeholder="Type to search"
        type="text"
        className="inputName"
        onChange={(event) => this.deb(event.target.value)}
       />
      
      )}
      <div className="spin-wrap">
       <Spin spinning={isLoadingAll} tip="Loading" size="large" className="spin">
        {(moviesData||error) ? (
         <MoviesList
          spin={spin}
          moviesData={moviesData}
          isLoadingAll={isLoadingAll}
          currentPage={currentPage}
          error={error}
          MoviesApi={this.MoviesApi}
          rateMovie={this.rateMovie}
         />
        ) : null}
       </Spin>
      </div>
     </div>
     <div className="paginationWrap">
      {moviesData ? (
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
      ) : null}
     </div>
    </div>
   </Provider>
  );
 }
}
