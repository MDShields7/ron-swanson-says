/* eslint-disable no-loop-func */
import React, { Component } from 'react'
import _ from 'lodash';

import starFull from "../Images/moment-star-full.svg";
import starEmpty from "../Images/moment-star-empty.svg";
import starNotRated from "../Images/moment-star-not-rated.svg";

export default class StarCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: props.id,
      index: props.index,
      rating: props.rating.stars,
      starType: props.rating.starType,
      starSelect: props.starSelect,
      localRating: null,
    }
  }
  componentDidMount = () => {
    let newRating = _.cloneDeep(this.state.rating)
    if (this.state.starType === 'overall' && newRating !== null) {
      newRating = Math.round(newRating);
      this.setState({ rating: newRating })
    }
  }
  componentDidUpdate = () => {
  }
  handleSelect = () => {
    const { id, index, localRating } = this.state;
    this.state.starSelect(localRating, id, index)
  }
  handleSelectLocal = (localRating) => {
    this.setState({ localRating: localRating })
  }
  render() {
    const { rating, starType, localRating } = this.state;
    let usedRating = rating;
    if (localRating !== null) {
      usedRating = localRating;
    }
    console.log('StarCard, this.state', this.state)
    // console.log('StarCard, this.props', this.props)
    const hasProp = this.props.hasOwnProperty('starSelect')
    // console.log('hasProp', hasProp)

    const showStars = () => {
      let starsMapped = [];
      for (let i = 0; i < 5; i++) {
        const starTemplate = (svg) => {
          if (starType === 'overall') {
            return (<div key={i} value={i + 1} ><img className="stars" src={svg} alt={''} /></div>)
          } else if (starType === 'mine') {
            if (hasProp) {
              return (<div key={i} value={i + 1} onClick={() => this.handleSelectLocal(i + 1)} ><img className="stars" src={svg} alt={''} /></div>)
            } else {
              return (<div key={i} value={i + 1} ><img className="stars" src={svg} alt={''} /></div>)
            }
          }
        }
        if (usedRating === null) {
          starsMapped.push(starTemplate(starNotRated));
        } else if (i < usedRating) {
          starsMapped.push(starTemplate(starFull));
        } else {
          starsMapped.push(starTemplate(starEmpty));
        }
      }
      return starsMapped;
    }
    return (
      <div>
        <div className='flex-row  card-contents'>
          {showStars()}
          {(starType === 'mine') && hasProp && (rating !== localRating) ? <button onClick={this.handleSelect} >Submit Rating</button> : hasProp ? <div value='cant submit yet'>Select your rating</div> : starType === 'overall' ? <div value='NA'></div> : <></>}
        </div>
      </div >
    )
  }
}
