import { Card } from 'antd';
import format from "date-fns/format";
import { registerLocale } from "react-datepicker";
import { enGB } from "date-fns/esm/locale";
import "./MyCard.css"
import {Component} from "react";
import {Rate, Space, Spin } from "antd";
import ErrorIndicator from "../Error-indicator/Error-indicator"
import contextApi from "../../services/contextApi.js";

registerLocale("enGB", enGB);

export default class MyCard extends Component {
  


  state= {
    id: this.props.id,
    currentPage:1,
    isLoadingPicture: true,
    error: false,
    rate: 0,
    api: this.props.api
  }

 

  changeRate = async (value) => {
const {api} = this.state;
    await this.setState({
      rate: value
    })
    const {id} = this.state;
    const rates = JSON.parse(localStorage.getItem('rates'));


    
      const data = await api.putRateMovie(id, value);

      if (data.success) {
        const newRates = JSON.stringify({ ...rates, [id]: value });

        localStorage.setItem('rates', newRates);
      } 
   
  };

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
      console.log('shouldComponentUpdate in if')
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
    console.log('ERRRRRRRRRRRRRRRRRRRRRRRRRORRRRRRRRRRRRRR')
  }

 
  onChangeRate = (value) => {
    this.changeRate(value);
  };

  render(){
    const {title,releaseDate, poster_path, overview,sliceText, rate} = this.props;
  
  
   const  spiner = this.state.isLoadingPicture ? <Space className="card-spiner-wrap" size="middle">
 <Spin className="card-spiner" size="large" />
</Space>: null;

   // const errIndicator = this.state.error ? <ErrorIndicator className="error-card" error={"Error 404"} message={"picture not found"} />:null;
    //  {errIndicator}
return (
  <Card className="card">
    <div className="row">
      <div className="col-left">
     
        {spiner}
      <img alt="Красивый постер фильма"
onLoad={this.handleImageLoaded.bind(this)}
onError={this.handleImageErrored.bind(this)}
className="poster"
src={`https://image.tmdb.org/t/p/original${poster_path}`}/>
      </div>
      <div className="col-right" flex="240px">
        <h5 className="nameMovie">{title}</h5>
        <span className="dateMovie">{format(new Date(releaseDate), "MMMM dd, yyyy", {
          locale: enGB,
        })}</span>
        
      </div>
      <div className="overview-wrap">
      <p className="overview">{sliceText(overview)}</p>
      <Rate count={10} onChange={this.onChangeRate} value={rate} className="card__rate" />
      </div>
    </div>
  </Card>
);

                }
}

