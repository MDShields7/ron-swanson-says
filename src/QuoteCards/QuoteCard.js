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
      this.setState({ quote: this.props.quote })
    }
  }
  render() {

    let { index, starSelect } = this.state;
    let { id, saying, type } = this.state.quote;
    return (
      <div className='card' >
        <div className='hor-rule-card'>
          <p className='quote'>"{saying}"</p>
          <p>Quote size: {type}</p>
          <p>Overall Rating {this.state.quote.stars === null ? '(Not Rated)' : ''}</p>
          <StarCard rating={{ starType: 'overall', stars: this.state.quote.stars }} rate={false} />
          <p>My Rating {this.state.quote.myStars === null ? '(Not Rated)' : ''}</p>
          {this.state.quote.myStars === null ?
            <StarCard rating={{ starType: 'mine', stars: this.state.quote.myStars }} id={id} index={index} starSelect={starSelect} />
            : <StarCard rating={{ starType: 'mine', stars: this.state.quote.myStars }} id={id} index={index} />}
        </div>
      </div>
    )
  }
}
