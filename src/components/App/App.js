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
    isOpenSession: false
  };

  componentDidMount() {
    this.getMovies("Road");
    this.openGuestSession();
    
    
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
    const { isOpenSession, pageApp } = this.state;
    const { isOpenSession: prevIsOpenSession, pageApp: prevPageApp } = prevState;

    if (isOpenSession !== prevIsOpenSession && isOpenSession) {
      this.getMovies();
    }
    if (pageApp !== prevPageApp && isOpenSession) {
      this.getMovies();
    }
  }

  componentWillUnmount() {
    //  clearInterval(this.intervalId);
  }

  getMovies = async (keyWord, page = 1) => {

    const { pageApp } = this.state;

    this.interval = await setTimeout(
      () => this.setState({ isLoadingAll: true }),
      0
    );

    await setTimeout(
      () =>{
        pageApp === 'Search' ? this.MoviesApi.getResource(keyWord, page)
          .then((serverData) => {
            this.setState({
              movieName: keyWord,
              moviesData: serverData.results,
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
            this.setState({
              movieName: keyWord,
              moviesData: serverData.results,
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
    console.log("isLoadingAll------------------", isLoadingAll);
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
