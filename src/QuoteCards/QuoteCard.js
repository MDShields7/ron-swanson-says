import React, { Component } from 'react'

// import './QuoteCard.scss';
import StarsCard from './StarsCard'

export default class QuoteCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      quote: props.quote,
    }
  }
  // componentDidMount = (prevProps) => {
  //   if ( this.props.quote !== prevProps.quote){
  //     this.setState({quote: this.props.quote})
  //   }
  // }
  render() {

    const { saying, stars, myStars } = this.state.quote;

    return (
      <div className='card' >
        <div className='hor-rule-card'>
          <p className='quote'>{saying}</p>
          <p>Rating</p>
          <StarsCard stars={stars} />
          <p>My Rating</p>
          <StarsCard stars={myStars} />
        </div>
      </div>
    )
  }
}
    /* quote format = {
id: null (null, or Number),
type: 'medium' ('small', 'medium', 'large')
saying: 'string',
stars:null (0-5 = 0-5, 1 increments),
myStars:null (0-5 = 0-5, 1 increments)
} */