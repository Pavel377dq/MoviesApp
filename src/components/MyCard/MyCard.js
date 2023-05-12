import { Col, Row } from "antd";
import { Card } from 'antd';
import format from "date-fns/format";
import { registerLocale } from "react-datepicker";
import { enGB } from "date-fns/esm/locale";
import "./MyCard.css"

registerLocale("enGB", enGB);

const MyCard = (props)=> {

  const {title,releaseDate, poster_path, overview,sliceText, key} = props;
  
return (<Card key={key} className="card">
              <Row>
                <Col  flex="auto">
                  <img alt="Красивый постер фильма"
                    style={{ width: "143px", height: "281" }}
                    className="poster"
                    src={`https://image.tmdb.org/t/p/original${poster_path}`}
                  />
                </Col>
                <Col  flex="200px">
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

export default MyCard