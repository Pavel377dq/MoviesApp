import React, { Component } from "react";
import ApiService from "../../services/ApiService";
import { Col, Row } from "antd";
import "./MoviesList.css";
import format from "date-fns/format";
import { registerLocale } from "react-datepicker";
import { enGB } from "date-fns/esm/locale";
registerLocale("enGB", enGB);

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
    // const overviews  = moviesData.map(el => {return el.overview})
    //const titleRows = moviesData.map(el => {return el.overview})

    const overviewRows = []; //dataRows

    let releaseDates = moviesData.map((el) =>
      el.release_date
        ? el.release_date
            .split("-")
            .slice(-2)
            .concat(el.release_date.split("-").slice(0, 1))
            .join("-")
        : "01-01-1970"
    );

    for (let i = 0; i < moviesData.length - 1; i++) {
      if (i % 2 === 0) {
        overviewRows.push(
          <Row className="row" /*gutter={[gutters['5'], vgutters['5']]}*/>
            <Col span={9} className="column" offset={2}>
              {" "}
              <Row>
                <Col className="innerColumn" flex="auto">
                  <img
                    style={{ width: "143px", height: "281" }}
                    className="poster"
                    src={`https://image.tmdb.org/t/p/original${moviesData[i].poster_path}`}
                  />
                </Col>
                <Col className="innerColumn" flex="200px">
                  <h5 className="nameMovie">{moviesData[i].title}</h5>
                  <span className="dateMovie">{format(new Date(releaseDates[i]), "MMMM dd, yyyy", {
                    locale: enGB,
                  })}</span>
                  <p className="overview">{this.sliceText(moviesData[i].overview)}</p>

                  
                </Col>
              </Row>
            </Col>
            <Col span={9} className="column" offset={2}>
              {" "}
              <Row>
                <Col flex="auto">
                  <img
                    style={{ width: "143px", height: "281" }}
                    className="poster"
                    src={`https://image.tmdb.org/t/p/original${
                      moviesData[i + 1].poster_path
                    }`}
                  />
                </Col>
                <Col flex="200px">
                  <h5  className="nameMovie">{moviesData[i + 1].title}</h5>
                  <span className="dateMovie">{format(new Date(releaseDates[i + 1]), "MMMM dd, yyyy", {
                    locale: enGB,
                  })}</span>
                  <p className="overview">{this.sliceText(moviesData[i + 1].overview)}</p>
                  
                </Col>
              </Row>
            </Col>
          </Row>
        );

        console.log(moviesData[i].poster_path, moviesData[i + 1].poster_path);
      }
    }
    return overviewRows;
  };

  render() {
    if (this.state.moviesData !== null) {
      const { moviesData } = this.state;

      console.log(moviesData);
      // moviesData.map(el => {return <li>{el.overview}</li>})
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
