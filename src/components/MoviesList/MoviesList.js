import React, { Component } from "react";
import ApiService from "../../services/ApiService";
import "./MoviesList.css";
import MyCard from "../MyCard/MyCard.js"



export default class MoviesList extends Component {
  MoviesApi = new ApiService();

  state = {
    moviesData: null,
  };

  constructor() {
    super();
    this.MoviesApi.getResource("001").then((serverData) => {
      this.setState({
        moviesData: serverData.results,
      });
    });
  }


  sliceText(text){
    const size = 30;
    let newText = text;
    
if(newText.length > size){
	newText = newText.split(' ').slice(0, size).join(' ') + '...'
}

return newText
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
       let {title,poster_path,overview} = this.state.moviesData[i];
  
        overviewRows.push(
          <MyCard releaseDate={releaseDate} sliceText={this.sliceText} poster_path={poster_path} overview = {overview} title={title} key={i}/>
        );

       
      
    }
    return overviewRows;
  };

  render() {
    if (this.state.moviesData !== null) {
      const { moviesData } = this.state;

      return (
        <main>
          <div className="wrap">
            {this.rows(moviesData).map((el) => {
              return el;
            })}
          </div>
        </main>
      );
    }
  }
}
