import React, { Component } from 'react'

// import './QuoteCard.scss';
import StarCard from './StarCard'
// import { id } from 'postcss-selector-parser';

export default class QuoteCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      quote: props.quote,
      index: props.value,
      starSelect: props.starSelect,
    }
  }
  componentDidUpdate = (prevProps) => {
    if (this.props.quote.id !== prevProps.quote.id) {
      this.setState({ quote: this.props.quote })
    }
  }
  render() {

    const { index, starSelect } = this.state;
    console.log('QuoteCard, index', index)
    const { id, saying, type, stars, myStars } = this.state.quote;
    console.log('id:', id, ', saying:', saying, ' type:', type, ' stars:', stars, ' myStars:', myStars)
    return (
      <div className='card' >
        <div className='hor-rule-card'>
          <p className='quote'>{saying}</p>
          <p className='quote'>id #:{id}</p>
          <p>Rating</p>
          <StarCard rating={stars} rate={false} />
          <p>My Rating</p>
          <StarCard rating={myStars} myRating={true} index={index} starSelect={starSelect} starSubmit={this.props.starSubmit} />
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