/* eslint-disable no-loop-func */
import React, { Component } from 'react'

import starFull from "../Images/moment-star-full.svg";
import starEmpty from "../Images/moment-star-empty.svg";
import starNotRated from "../Images/moment-star-not-rated.svg";

export default class StarCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rating: props.rating,
      index: props.index,
      starSelect: props.starSelect,
      starSubmit: props.starSubmit,
      myRating: props.myRating,
    }
  }
  handleSelect = (rated) => {
    const { index } = this.state;
    console.log('index is', index)
    console.log('rated is', rated)
    this.state.starSelect(rated, index)
    this.setState({ rating: rated })
  }
  render() {
    const { rating, starSelect, starSubmit } = this.state;
    console.log('rating', rating)
    const showStars = rating => {
      if (rating != null) {
        rating = Math.round(rating);
      }
      let starsMapped = [];
      for (let i = 0; i < 5; i++) {
        if (rating === null) {
          console.log('starcard not rated', rating, i)
          starsMapped.push(<div key={i} value={i + 1} onClick={starSelect ? (() => this.handleSelect(i + 1)) : ''} ><img className="stars" src={starNotRated} alt='rating' /></div>);
        } else if (i < rating) {
          console.log('starcard full', rating)
          starsMapped.push(<div key={i} value={i + 1} onClick={starSelect ? (() => this.handleSelect(i + 1)) : ''} ><img className="stars" src={starFull} alt='rating' /></div>);
        } else {
          console.log('starcard empty', rating)
          starsMapped.push(<div key={i} value={i + 1} onClick={starSelect ? (() => this.handleSelect(i + 1)) : ''} ><img className="stars" src={starEmpty} alt='rating' /></div>);
        }
      }
      return starsMapped;
    };
    return (
      <div>
        <div className='flex-row  card-contents'>
          {showStars(rating)}
          {starSelect && rating ? <button onClick={starSubmit} >Submit Rating</button> : <div>NO BUTTON</div>}
        </div>
      </div>
    )
  }
}
