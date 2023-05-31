import React, { Component } from "react";
import "./MoviesList.css";
import MyCard from "../MyCard/MyCard.js";
import ErrorIndicator from "../Error-indicator/Error-indicator"

export default class MoviesList extends Component {




  sliceText(text) {
    const size = 30;
    let newText = text;

    if (newText.length > size) {
      newText = newText.split(" ").slice(0, size).join(" ") + "...";
    }

    return newText;
  }

  rows = (moviesData = null) => {
   
    const overviewRows = [];

    let releaseDates = moviesData.map((el) =>
      el.release_date
        ? el.release_date
            .split("-")
            .slice(-2)
            .concat(el.release_date.split("-").slice(0, 1))
            .join("-")
        : "01-01-1970"
    );

   

    for (let i = 0; i < moviesData.length; i++) {
      let releaseDate = releaseDates[i];
      let { title, poster_path, overview,id,rating,vote_average } = moviesData[i];
      overviewRows.push(
        <MyCard
        currentPage={this.props.currentPage}
          releaseDate={releaseDate}
          sliceText={this.sliceText}
          poster_path={poster_path}
          overview={overview}
          title={title}
          vote_average={vote_average}
          key={i}
          id={id}
          rate={rating}
          api={this.props.MoviesApi}
          rateMovie={this.props.rateMovie}/>
      );
    }

    

    return overviewRows;
  };

  render() {
    const { moviesData,error } = this.props;
   

    
    
    const rows = this.rows(moviesData).map((el) => {
          return el;
        })

    const errorMessage = error ? <ErrorIndicator className="error-list" error={'Error 404'} message={'Data of input movies not found'}/>: null;

 

    return (
      <main className="main">
        <div className="block">
        <div className="wrap">
          {errorMessage}
          {rows}
        </div>
        </div>
      </main>
    );
  }
}
