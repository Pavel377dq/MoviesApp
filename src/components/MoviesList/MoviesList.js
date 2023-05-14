import React, { Component } from "react";
import ApiService from "../../services/ApiService";
import "./MoviesList.css";
import MyCard from "../MyCard/MyCard.js";
import { Space, Spin } from "antd";
import ErrorIndicator from "../Error-indicator/Error-indicator"

export default class MoviesList extends Component {
  MoviesApi = new ApiService();

  state = {
    moviesData: null,
    isLoadingAll: true,
    error: false
  };

  constructor() {
    super();
    this.MoviesPromise = this.MoviesApi.getResource('Better').then((serverData) => {
      this.setState({
        moviesData: serverData.results,
        isLoadingAll: false,
        error: false
      });
    }).catch((err)=> {
      this.setState({
        error: true,
        isLoadingAll: false
      })})
  }

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
      let { title, poster_path, overview } = this.state.moviesData[i];
      overviewRows.push(
        <MyCard
          releaseDate={releaseDate}
          sliceText={this.sliceText}
          poster_path={poster_path}
          overview={overview}
          title={title}
          key={i}
        />
      );
    }
    return overviewRows;
  };

  render() {
    const { moviesData, isLoadingAll,error } = this.state;

    const hasData = !(isLoadingAll || error)

    const rows = hasData
      ? this.rows(moviesData).map((el) => {
          return el;
        })
      : null;

    const errorMessage = error ? <ErrorIndicator className="error-list" error={'Error 404'} message={'Data of input movies not found'}/>: null;

    const spiner = isLoadingAll ? (
      <Space className="spin-wrap" size="middle">
        <Spin className="spin" size="large" />
      </Space>
    ) : null;

    return (
      <main>
        <div className="wrap">
          {errorMessage}
          {spiner}
          {rows}
        </div>
      </main>
    );
  }
}
