import { Card } from 'antd';
import format from "date-fns/format";
import { registerLocale } from "react-datepicker";
import { enGB } from "date-fns/esm/locale";
import "./MyCard.css"
import {Component} from "react";
import {Rate, Space, Spin } from "antd";
import ErrorIndicator from "../Error-indicator/Error-indicator"
import contextApi from "../../services/contextApi.js";
import Progress from '../Progress/progress.js'

registerLocale("enGB", enGB);

export default class MyCard extends Component {
  


  state= {
   // id: this.props.id,
    currentPage:1,
    isLoadingPicture: true,
    error: false,
    rate: 0,
    api: this.props.api
  }

 

  changeRate = async (value) => {

   
    const {id} = this.props;
    const {rateMovie} = this.props;



    
      
      rateMovie(id,value)

   
  };

  /*componentWillUpdate(prevProps, prevState, prevContext){

    if(prevProps.currentPage !== this.state.currentPage){
      this.setState({ currentPage: this.props.currentPage,
        isLoadingPicture: true });

        ('OKOKOKOKOKOKOKOK')
    }

    ('componentDidUpdate')
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
    
  }

  handleImageErrored(evt) {
    evt.preventDefault();
    this.setState({ isLoadingPicture: false, error: true });
   
  }

 
  onChangeRate = (value) => {
    this.changeRate(value);
  };

  colorVote = (vote) =>{

    let voteColor = ''
    if (vote < 3) {
      voteColor = '#E90000'
    } else if (vote >= 3 && vote <= 5) {
      voteColor = '#E97E00'
    } else if (vote > 5 && vote <= 7) {
      voteColor = '#E9D100'
    } else{
      voteColor = '#66E900'
    }

    return voteColor;
  }

  render(){
    const {title,releaseDate, poster_path, overview,sliceText,vote_average } = this.props;
    const { rate} = this.props;
  
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
      <div className="col-right" >
        <h5 className="nameMovie">{title}</h5>
        <Progress className='progress' percent={vote_average  * 10} color={this.colorVote(vote_average)} />
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

