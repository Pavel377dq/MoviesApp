import React, { Component } from "react";
import "./MoviesList.css";
import MyCard from "../MyCard/MyCard.js";
import { Space, Spin } from "antd";
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
    console.log(moviesData,'in rows()')
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

    console.log(releaseDates,'releaseDates');

    for (let i = 0; i < moviesData.length; i++) {
      let releaseDate = releaseDates[i];
      let { title, poster_path, overview } = moviesData[i];
      overviewRows.push(
        <MyCard
        currentPage={this.props.currentPage}
          releaseDate={releaseDate}
          sliceText={this.sliceText}
          poster_path={poster_path}
          overview={overview}
          title={title}
          key={i}
        />
      );
    }

    console.log(overviewRows,'overviewRows');

    return overviewRows;
  };

  render() {
    const { moviesData, isLoadingAll,error } = this.props;

    const hasData = isLoadingAll || error;//!(...)?
    console.log(isLoadingAll,'isLoadingAll');
    console.log(error,'error');
    console.log(moviesData,'moviesData');
    const rows = hasData
      ? this.rows(moviesData).map((el) => {
          return el;
        })
      : null;

    const errorMessage = error ? <ErrorIndicator className="error-list" error={'Error 404'} message={'Data of input movies not found'}/>: null;

    const spiner = !isLoadingAll ? (
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
