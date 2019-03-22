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
      rated: false,
    }
  }
  handleSelect = (rating) => {
    const { index } = this.state;
    console.log('index is', index)
    console.log('rating is', rating)
    this.state.starSelect(rating, index)
    this.setState({ rating: rating })
  }
  handleSubmit = () => {
    if (this.state.rating !== null) {
      this.state.starSubmit()
      this.setState({ rated: true })
    }
  }
  render() {
    const { rating, starSelect, rated } = this.state;
    console.log('STAR CARD, starSelect === null', starSelect === null)
    console.log('rating', rating)
    console.log('this.props.myStars', this.props.myStars)
    const hasProp = this.props.hasOwnProperty('starSelect')
    console.log('hasProp', hasProp)
    const showStars = rating => {
      if (rating != null) {
        rating = Math.round(rating);
      }
      let starsMapped = [];
      for (let i = 0; i < 5; i++) {
        if (rating === null) {
          // console.log('starcard not rated', rating, i)
          starsMapped.push(<div key={i} value={i + 1} onClick={starSelect ? (() => this.handleSelect(i + 1)) : ''} ><img className="stars" src={starNotRated} alt='rating' /></div>);
        } else if (i < rating) {
          // console.log('starcard full', rating)
          starsMapped.push(<div key={i} value={i + 1} onClick={starSelect ? (() => this.handleSelect(i + 1)) : ''} ><img className="stars" src={starFull} alt='rating' /></div>);
        } else {
          // console.log('starcard empty', rating)
          starsMapped.push(<div key={i} value={i + 1} onClick={starSelect ? (() => this.handleSelect(i + 1)) : ''} ><img className="stars" src={starEmpty} alt='rating' /></div>);
        }
      }
      return starsMapped;
    };
    return (
      <div>
        <div className='flex-row  card-contents'>
          {showStars(rating)}
          {/* {!hasProp ? 'not mine to select' : rated ? 'mine to select & rated' : 'mine to select & not rated'} */}
          {/* {hasProp && rated ? 'rating finished' : hasProp ? 'mine to select & rate' : 'no rating to give'} */}
          {hasProp && rated ? <div></div> : hasProp ? <button onClick={this.handleSubmit} >Submit Rating</button> : <div></div>}
        </div>
      </div>
    )
  }
}
