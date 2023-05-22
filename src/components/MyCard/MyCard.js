import { Col, Row } from "antd";
import { Card } from 'antd';
import format from "date-fns/format";
import { registerLocale } from "react-datepicker";
import { enGB } from "date-fns/esm/locale";
import "./MyCard.css"
import {Component} from "react";
import { Space, Spin } from "antd";
import ErrorIndicator from "../Error-indicator/Error-indicator"

registerLocale("enGB", enGB);

export default class MyCard extends Component {
  

  state= {
    currentPage:1,
    isLoadingPicture: true,
    error: false
  }


  /*componentWillUpdate(prevProps, prevState, prevContext){

    if(prevProps.currentPage !== this.state.currentPage){
      this.setState({ currentPage: this.props.currentPage,
        isLoadingPicture: true });

        console.log('OKOKOKOKOKOKOKOK')
    }

    console.log('componentDidUpdate')
  }*/

  shouldComponentUpdate(nextProps){

    if(nextProps.currentPage !== this.state.currentPage){
      this.setState({ currentPage: nextProps.currentPage,
        isLoadingPicture: true });
    }

    return true;
  }

  /*componentWillUnmount(){
    this.setState({ currentPage: this.props.currentPage,
      isLoadingPicture: true });
  }*/

  handleImageLoaded() {
    this.setState({ isLoadingPicture: false });
    console.log('handleImageLoaded')
  }

  handleImageErrored(evt) {
    evt.preventDefault();
    this.setState({ isLoadingPicture: false, error: true });
  }

 


  render(){
    const {title,releaseDate, poster_path, overview,sliceText} = this.props;
  
  
   const  spiner = this.state.isLoadingPicture ? <Space className="card-spiner-wrap" size="middle">
 <Spin className="card-spiner" size="large" />
</Space>: null;

   // const errIndicator = this.state.error ? <ErrorIndicator className="error-card" error={"Error 404"} message={"picture not found"} />:null;
    //  {errIndicator}
return (
  <Card className="card">
    <Row className="row">
      <Col className="col-left" flex="183px">
     
        {spiner}
      <img alt="Красивый постер фильма"
onLoad={this.handleImageLoaded.bind(this)}
onError={this.handleImageErrored.bind(this)}
style={{ width: "183px", height: "281px" }}
className="poster"
src={`https://image.tmdb.org/t/p/original${poster_path}`}/>
      </Col>
      <Col className="col-right" flex="240px">
        <h5 className="nameMovie">{title}</h5>
        <span className="dateMovie">{format(new Date(releaseDate), "MMMM dd, yyyy", {
          locale: enGB,
        })}</span>
        <p className="overview">{sliceText(overview)}</p>

        
      </Col>
    </Row>
  </Card>
);

                }
}

