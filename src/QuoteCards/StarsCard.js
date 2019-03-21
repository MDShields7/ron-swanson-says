import React from 'react'

import starFull from "../Images/moment-star-full.svg";
import starEmpty from "../Images/moment-star-empty.svg";
import starNotRated from "../Images/moment-star-not-rated.svg";

export default function StarsCard(props) {
  const { stars } = props;
  const showStars = rating => {
    if (rating != null) {
      rating = Math.round(rating);
    }
    let starsMapped = [];
    for (let i = 0; i < 5; i++) {
      if (rating === null) {
        starsMapped.push(<img className="stars" alt='quote rating in stars' src={starNotRated} />);
      } else if (i < rating) {
        starsMapped.push(<img className="stars" alt='quote rating in stars' src={starFull} />);
      } else {
        starsMapped.push(<img className="stars" alt='quote rating in stars' src={starEmpty} />);
      }
    }
    return starsMapped;
  };
  return (
    <div class='flex-row'>
      {showStars(stars)}
    </div>
  )
}

