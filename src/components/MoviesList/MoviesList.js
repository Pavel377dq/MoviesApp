/* eslint-disable camelcase */
import React, { Component } from 'react';

import './MoviesList.css';
import MyCard from '../MyCard/MyCard';
import ErrorIndicator from '../Error-indicator/Error-indicator';

export default class MoviesList extends Component {


  shouldComponentUpdate(nextProps){

    if(nextProps !== this.props){
      return true;
    }

    return false;
  }

 rows = (moviesData = null) => {
  const overviewRows = [];

  const releaseDates = moviesData.map((el) =>
   el.release_date
    ? el.release_date.split('-').slice(-2).concat(el.release_date.split('-').slice(0, 1)).join('-')
    : '01-01-1970'
  );

  for (let i = 0; i < moviesData.length; i+=1) {
   const releaseDate = releaseDates[i];
   // eslint-disable-next-line camelcase
   const { title, poster_path, overview, id, rating, vote_average, genre_ids } = moviesData[i];
   const {currentPage,MoviesApi,rateMovie} = this.props;
   overviewRows.push(
    <MyCard
     currentPage={currentPage}
     releaseDate={releaseDate}
     sliceText={this.sliceText}
     posterPath={poster_path}
     overview={overview}
     title={title}
     voteAverage={vote_average}
     key={i}
     genreIds={genre_ids}
     id={id}
     rate={rating}
     api={MoviesApi}
     rateMovie={rateMovie}
    />
   );
  }

  return overviewRows;
 };

 // eslint-disable-next-line class-methods-use-this
 sliceText(text,titleLength,tagsLenServer){
  let size;

  const tagsLen = tagsLenServer || 1;

  if(titleLength > 40 && tagsLen >=3){
    size = 5;
  }
  else if(titleLength > 15 && titleLength <= 40 && tagsLen <3) {
    size = 10;
  }
  else{
    size = 20;
  }
  let newText = text;

  if (newText.length > size) {
   newText = `${newText.split(' ').slice(0, size).join(' ')  }...`;
  }

  return newText;
 };

 render() {
  const { moviesData, error } = this.props;
  const rows = moviesData? this.rows(moviesData).map((el) => el): null;
const errorMessage = error ? (
  <ErrorIndicator className="error-list" error={error}  />
 ) : null;
 

  return (
     <div className="flexWrap">
      {errorMessage}
      {rows}
     </div>
  );
 }
}
