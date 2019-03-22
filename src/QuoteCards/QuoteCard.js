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
    if (this.props.quote.id !== prevProps.quote.id
      || this.props.quote.myStars !== prevProps.quote.myStars) {
      console.log('QUOTECARD, SETSTATE')
      this.setState({ quote: this.props.quote })
    }
  }
  render() {

    let { index, starSelect } = this.state;
    console.log('QuoteCard, index', index)
    console.log('QUOTECARD, this.props', this.props)
    console.log('QUOTECARD, this.state', this.state)
    // let quote = this.state.quote;
    let { id, saying, type, stars, myStars } = this.state.quote;
    console.log('id:', id, ', saying:', saying, ' type:', type, ' stars:', stars, ' myStars:', myStars)
    console.log('myStars', myStars)
    console.log('myStars === true', myStars === true)
    return (
      <div className='card' >
        <div className='hor-rule-card'>
          <p className='quote'>{saying}</p>
          <p className='quote'>id #:{id}</p>
          <p>Rating</p>
          <StarCard rating={stars} rate={false} />
          <p>My Rating</p>
          {/* {myStars ? 'rated' : 'not rated'} */}
          {myStars ? (<StarCard rating={myStars} index={index} starSelect={starSelect} />) : (<StarCard rating={myStars} index={index} starSelect={starSelect} starSubmit={this.props.starSubmit} />)}
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