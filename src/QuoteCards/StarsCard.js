import React from 'react'

import starFull from "../Images/moment-star-full.svg";
import starEmpty from "../Images/moment-star-empty.svg";
import starNotRated from "../Images/moment-star-not-rated.svg";

export default function StarsCard(props) {
  const { rating, rate, index, starSelect } = props;
  let submitBtn = false;
  let myRating = rating;
  console.log('rating', rating)
  console.log('myRating === true', myRating === true)
  function handleSelect(rated) {
    myRating = rated
    console.log('myRating is', rated)
    submitBtn = starSelect(rated, index)
  }
  const showStars = rating => {
    if (rating != null) {
      rating = Math.round(rating);
    }
    let starsMapped = [];
    // let counter = 0;

    for (let i = 0; i < 5; i++) {
      if (rating === null) {
        console.log('starcard not rated', rating, i)
        // counter += 1;
        starsMapped.push(<div key={i} value={i + 1} onClick={rate ? (() => handleSelect(i + 1)) : ''} ><img className="stars" src={starNotRated} alt='rating' /></div>);
      } else if (i < rating) {
        console.log('starcard full', rating)
        // counter += 1;
        starsMapped.push(<div key={i} ><img className="stars" src={starFull} alt='rating' /></div>);
      } else {
        console.log('starcard empty', rating)
        // counter += 1;
        starsMapped.push(<div key={i} ><img className="stars" src={starEmpty} alt='rating' /></div>);
      }
    }
    return starsMapped;
  };
  return (
    <div className='flex-row  card-contents'>
      {showStars(rating)}
      {rate && myRating ? <button onClick={submitBtn} >Submit Rating</button> : <button onClick={submitBtn} >NO Submit Rating</button>}
    </div>
  )
}

// {() => { this.props.addSet(elemIndex) }}

