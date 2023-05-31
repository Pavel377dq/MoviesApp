import MoviesList from "../MoviesList/MoviesList";
import "inter-ui/inter.css";
import { Component } from "react";
import { Offline } from "react-detect-offline";
import { debounce } from "lodash";
import ApiService from "../../services/ApiService";
import { Pagination } from "antd";
import { Spin } from "antd";
import "./App.css";
import TopBar from '../TopBar/TopBar';
import contextApi from '../../services/contextApi.js';

export default class App extends Component {
  MoviesApi = new ApiService();

  state = {
    pageApp: 'Search',
    moviesData: null,
    isLoadingAll: false,
    spin: true,
    error: false,
    totalItems: 0,
    currentPage: 1,
    movieName: "",
    isOpenSession: false,
    ratesMovies: []
  };

  genres=null;

  componentDidMount() {
    console.log("App DidMount")
   // const dataOfRatedMovies = MoviesApi
   this.openGuestSession();
    this.getMovies("Road");
    this.setState({movieName: "Road"})
    this.MoviesApi.getGenre().then((data) => {
      this.genres = data.genres
    })
    
  }

  rateMovie = (filmId, rate) => {
   
    this.MoviesApi
      .putRateMovie(filmId, rate)
      .then(() => {
        this.setState(({ moviesData,ratesMovies }) => {
          const newMovieList = moviesData.map((movie) =>
            movie.id === filmId ? { ...movie, rating: rate } : { ...movie }
          )

          const newRatesMovies = [...ratesMovies];
          newRatesMovies.push( filmId );
          
         
          return { moviesData: newMovieList,ratesMovies: newRatesMovies}
        })
      })
      //.catch(() => this.setState({ status: 'error' }))
  }
  
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


  componentDidUpdate(prevProps, prevState) {
    console.log('App DidUpdate')
    const { isOpenSession, pageApp,movieName,currentPage } = this.state;
    const { isOpenSession: prevIsOpenSession, pageApp: prevPageApp } = prevState;

    if (isOpenSession !== prevIsOpenSession && isOpenSession) {
      this.getMovies(movieName,currentPage);
    }
    if (pageApp !== prevPageApp && isOpenSession) {
      this.getMovies(movieName,currentPage);
    }
  }

  componentWillUnmount() {
    //  clearInterval(this.intervalId);
   /* const {ratesMovies} = this.state;
    for(let i=0; i< ratesMovies.length;i++){
      this.MoviesApi.deleteRateMovie(ratesMovies[i].id);
    }*/

   
   // this.MoviesApi.deleteRateMovie();
  }

  getMovies = async (keyWord, page = 1) => {

    const { pageApp } = this.state;

    this.interval =  setTimeout(
      () => this.setState({ isLoadingAll: true }),
      0
    );
    let pageNumber =1;
    let   ratedMovies =  await this.MoviesApi.getAllRatedMovies(pageNumber);
    let totalRes = ratedMovies.total_results;
    let allRatedMovies =[]
    while(totalRes > 0){
      totalRes-=20;
      allRatedMovies.push(...ratedMovies.results)
      pageNumber++;
      ratedMovies =  await this.MoviesApi.getAllRatedMovies(pageNumber)
    }
    console.log(allRatedMovies,'allRatedMovies', allRatedMovies.length,'allRatedMovies.length')
     setTimeout(
      () =>{

      
      /* this.MoviesApi.getRatedMovies(page).then((serverData)=>{
        serverData.results.length !== 0? ratedMovies = serverData.results :  ratedMovies =[]
       })*/
        pageApp === 'Search' ? this.MoviesApi.getResource(keyWord, page)
          .then((serverData) => {
          /*  const ratesMovies = serverData.results.map((movie)=>{
              return {...movie, rate: 0}
            })*/
            /*const {ratesMovies} = this.state;
            const movies = serverData.results.map((movie) =>{
             for(let i=0; i < ratesMovies.length;i++){
              if(ratesMovies[i].id ===movie.id && ratesMovies[i].overview ===movie.overview){
                movie.rate=ratesMovies[i].rate;
                (movie,"MOVIE IN CIRCLE MAP+++++++++++++++++++++++++++++++++++++++++++",ratesMovies[i].rate, '----',movie.rate)
              }
              else{
                movie.rate = 0;
              }
             }
              return movie;
            })
            (movies,'MOVIES AFTER RATED')*/
            //console.log(ratedMovies,'ratedMovies','lenght',ratedMovies.results.length)
            //let count = 0
            const movies = allRatedMovies.length !== 0 ?serverData.results.map((movie) =>{
              //const mov = Object.assign({},movie)
              for(let i=0; i < allRatedMovies.length;i++){
               if(allRatedMovies[i].id ===movie.id){
              //  count++;

                //console.log(ratedMovies.results[i].original_title,'===', movie.original_title
                //)
                 movie.rating=allRatedMovies[i].rating;
                 //console.log('movie rating',movie.rating)
                 //console.log(count);
                // break
               }
              
              }

               return movie;
             }):serverData.results;
              
             console.log('MOVIES',movies)
            this.setState({
              movieName: keyWord,
              moviesData: movies,
              totalItems: serverData.total_results,
              currentPage: serverData.page,
              isLoadingAll: false, //false?
              error: false,
              spin: false,
            });
          })
          .catch((err) => {
            this.setState({
              error: true,
              isLoadingAll: false,
              moviesData: null,
              spin: false,
            });
          }): this.MoviesApi.getRatedMovies(page).then((serverData) => {

            /*const {ratesMovies} = this.state;
            const movies = serverData.results.map((movie) =>{
             for(let i=0; i < ratesMovies.length;i++){
              if(ratesMovies[i].id ===movie.id && ratesMovies[i].overview ===movie.overview){
                movie.rate=ratesMovies[i].rate;
              }
              else{
                movie.rate = 0;
              }
             }
              return movie;
            })*/
           
            this.setState({
              movieName: keyWord,
              moviesData:  serverData.results,
              totalItems: serverData.total_results,
              currentPage: serverData.page,
              isLoadingAll: false, //false?
              error: false,
              spin: false,
            });
          })
          .catch((err) => {
            this.setState({
              error: true,
              isLoadingAll: false,
              moviesData: null,
              spin: false,
            })})},
      1500
    );
  };

  deb = debounce((keyWord) => {
    this.getMovies(keyWord);
  }, 1000);

  changePage = (page) => {
    const { movieName } = this.state;

    this.getMovies(movieName, page);
  };

  changePageApp = (pageApp) => {
    this.setState({
      pageApp,
    });
  };

  

  //jukhuih
  render() {
    const { moviesData, isLoadingAll, error, currentPage, totalItems, pageApp,spin } =
      this.state;
  
    return (
      <contextApi.Provider value={this.MoviesApi}>
      <div>
        <div>
          <Offline className="offline">Only shown offline (surprise!)</Offline>
          <TopBar pageApp={pageApp} changePageApp={this.changePageApp} />
          {pageApp === 'Search' &&(
          <input
            placeholder="Type to search"
            type="text"
            className="inputName"
            onChange={(event) => this.deb(event.target.value)}
          />)}
          <div className="spin-wrap">
            <Spin
              spinning={isLoadingAll}
              tip="Loading"
              size="large"
              className="spin"
            >
              {moviesData ? (
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

      </contextApi.Provider>
    );
  }
}
