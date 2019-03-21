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
    let counter = 0;
    for (let i = 0; i < 5; i++) {
      if (rating === null) {
        counter += 1;
        starsMapped.push(<img className="stars" alt='quote rating in stars' src={starNotRated} key={counter} />);
      } else if (i < rating) {
        counter += 1;
        starsMapped.push(<img className="stars" alt='quote rating in stars' src={starFull} key={counter} />);
      } else {
        counter += 1;
        starsMapped.push(<img className="stars" alt='quote rating in stars' src={starEmpty} key={counter} />);
      }
    }
    return starsMapped;
  };
  return (
    <div className='flex-row  card-contents'>
      {showStars(stars)}
    </div>
  )
}

