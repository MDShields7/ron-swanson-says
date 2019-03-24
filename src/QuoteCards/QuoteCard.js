import React, { Component } from 'react'
import _ from 'lodash';

import StarCard from './StarCard'

export default class QuoteCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      quote: props.quote,
      index: props.value,
      starSelect: props.starSelect,
    }
  }
  componentDidUpdate = (prevProps, prevState) => {
    if (_.isEqual(this.props.quote, this.state.quote) === false) {
      //   if (this.props.quote !== prevProps.quote
      //     || this.props.quote.id !== prevProps.quote.id
      //     || this.props.quote.myStars !== prevProps.quote.myStars) {
      console.log('QUOTECARD UPDATE, SETSTATE')
      this.setState({ quote: this.props.quote })
    }
  }
  render() {
    console.log(`QUOTECARD index ${index}, this.props`, this.props)
    console.log(`QUOTECARD index ${index}, this.state`, this.state)
    let { index, starSelect } = this.state;
    let { id, saying } = this.state.quote;
    return (
      <div className='card' >
        <div className='hor-rule-card'>
          <p className='quote'>{saying}</p>
          {/* <p className='quote'>id #:{id}</p> */}
          <p>Overall Rating</p>
          <StarCard rating={{ starType: 'overall', stars: this.state.quote.stars }} rate={false} />
          <p>My Rating</p>
          {this.state.quote.myStars === null ?
            <StarCard rating={{ starType: 'mine', stars: this.state.quote.myStars }} id={id} index={index} starSelect={starSelect} />
            : <StarCard rating={{ starType: 'mine', stars: this.state.quote.myStars }} id={id} index={index} />}
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