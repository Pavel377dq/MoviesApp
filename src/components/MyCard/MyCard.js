/* eslint-disable react/destructuring-assignment */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/no-unused-state */
import { Card, Tag , Rate, Space, Spin } from 'antd';
import format from 'date-fns/format';
import { registerLocale } from 'react-datepicker';
import { enGB } from 'date-fns/esm/locale';
import './MyCard.css';
import { Component } from 'react';


import { Consumer } from '../../services/contextApi';
import Progress from '../Progress/progress';

registerLocale('enGB', enGB);

export default class MyCard extends Component {

  constructor(){
    super();
    this.state = {
      currentPage: 1,
      isLoadingPicture: true,
      error: false
     };
  }
 


 /* componentWillUpdate(prevProps, prevState, prevContext){

    if(prevProps.currentPage !== this.state.currentPage){
      this.setState({ currentPage: this.props.currentPage,
        isLoadingPicture: true });

        ('OKOKOKOKOKOKOKOK')
    }

    ('componentDidUpdate')
  } */

 shouldComponentUpdate(nextProps) {
  const {currentPage} = this.state;
  if (nextProps.currentPage !== currentPage) {
   this.setState({ currentPage: nextProps.currentPage, isLoadingPicture: true });
  }

  return true;
 }

 /* componentWillUnmount(){
    this.setState({ currentPage: this.props.currentPage,
      isLoadingPicture: true });
  } */

 handleImageLoaded() {
  this.setState({ isLoadingPicture: false });
 }

 handleImageErrored(evt) {
  evt.preventDefault();
  this.setState({ isLoadingPicture: false, error: true });
 }

 
 changeRate = async (value) => {
  const { id } = this.props;
  const { rateMovie } = this.props;

  rateMovie(id, value);
 };

 onChangeRate = (value) => {
  this.changeRate(value);
 };

 colorVote = (vote) => {
  let voteColor = '';
  if (vote < 3) {
   voteColor = '#E90000';
  } else if (vote >= 3 && vote <= 5) {
   voteColor = '#E97E00';
  } else if (vote > 5 && vote <= 7) {
   voteColor = '#E9D100';
  } else {
   voteColor = '#66E900';
  }

  return voteColor;
 };

 render() {
  const { title, releaseDate, posterPath, overview, sliceText, voteAverage, genreIds,rate } = this.props;

  const spiner = this.state.isLoadingPicture ? (
   <Space className="card-spiner-wrap" size="middle">
    <Spin className="card-spiner" size="large" />
   </Space>
  ) : null;

 
  return (
   <Card className="card">
    <div className="row">
     <div className="col-left">
      {spiner}
      <img
       alt="Красивый постер фильма"
       onLoad={this.handleImageLoaded.bind(this)}
       onError={this.handleImageErrored.bind(this)}
       className="poster"
       src={`https://image.tmdb.org/t/p/original${posterPath}`}
      />
     </div>
     <div className="col-right">
      <h5 className="nameMovie">{title}</h5>
      <Progress className="progress" percent={voteAverage * 10} color={this.colorVote(voteAverage)} />
      <span className="dateMovie">
       {format(new Date(releaseDate), 'MMMM dd, yyyy', {
        locale: enGB,
       })}
      </span>
      <div className="genres">
       <Consumer>
        {(genres) => genreIds.length !== 0 ? (
          genreIds.map((genreId) => {
           const tag = genres.filter((item) => item.id === genreId);
           return (
            <Tag className="genre" key={genreId}>
             {tag[0].name}
            </Tag>
           );
          })
         ) : (
          <Tag className="genre" key={999999}>
           Заглушка
          </Tag>
         )}
       </Consumer>
      </div>
     </div>
     <div className="overview-wrap">
      <p className="overview">{sliceText(overview)}</p>
      <Rate count={10} allowHalf onChange={this.onChangeRate} value={rate} className="cardRate" />
     </div>
    </div>
   </Card>
  );
 }
}
