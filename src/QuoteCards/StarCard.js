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
    if (_.isEqual(this.props.rating.stars, this.state.rating) === false) {
      let newRating = _.cloneDeep(this.state.rating)
      if (this.state.starType === 'overall' && newRating !== null) {
        newRating = Math.round(newRating);
        this.setState({ rating: newRating, rating: this.props.rating.stars })
      } else {
        this.setState({ rating: this.props.rating.stars })
      }
    }
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
    const hasProp = this.props.hasOwnProperty('starSelect')

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
      <div className='center'>
        <div className='card-contents'>
          {showStars()}
        </div>
        {(starType === 'mine') && hasProp && (rating !== localRating) ? <button className='lil-button' onClick={this.handleSelect} >Submit Rating</button> : hasProp ? <div value='cant submit yet'>Select your rating</div> : starType === 'overall' ? <div value='NA'></div> : <></>}
      </div >
    )
  }
}
