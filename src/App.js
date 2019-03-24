import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';

import './App.scss';
import QuoteCard from './QuoteCards/QuoteCard'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      quotes: [],
      indexList: [],
      quoteType: 'medium',
      quoteCards: [],
      lengthButtons: [],
    }
  }
  componentDidMount = () => {
    this.checkVisitor()
    this.loadTypeBtns()
  }
  componentDidUpdate = (prevProps, prevState) => {
    if (_.isEqual(this.state.quotes, prevState.quotes) === false) {
      this.loadCards();
    } else if (prevState.quoteType !== this.state.quoteType) {
      this.loadTypeBtns()
    }
  }
  checkVisitor = () => {
    axios.get("/api/visitor/check")
      .then(res => {
        this.setState({ user: res.data })
        if (res.data === '') {
          this.registerVisitor()
        }
      })
      .catch(err => console.log('error at checkVisitor', err))
  }
  registerVisitor = () => {
    axios.post("/api/visitor/register", { A: 'ok' })
      .then(res => {
        this.setState({ user: res.data })
      })
      .catch(err => console.log('error at registerVisitor', err))
  }

  getAllQuoteInfo = async (qNew, qId, qIndex) => {
    const { user } = this.state;
    let quoteType = _.cloneDeep(this.state.quoteType)
    const lastQuote = this.state.quotes.length - 1;
    let checkReq;
    let sayingResult;
    if (qNew === false) {
      // REQUEST QUOTES
      const quotesReq = await axios.get('https://ron-swanson-quotes.herokuapp.com/v2/quotes/58')
      sayingResult = this.loopThruResults(quotesReq.data, quoteType)
      // CHECK IF QUOTE IS ON FILE, GET ID ( OR REGISTER, GET ID )
      checkReq = await axios.get('/api/quote/check', {
        params: { saying: sayingResult, type: quoteType }
      })
      if (checkReq.data[0] === undefined) {
        checkReq = await axios.post('/api/quote/register', {
          saying: sayingResult, type: quoteType
        })
      }
    } else if (qNew === true) {
      checkReq = await axios.get('/api/quote/getById', {
        params: { id: qId }
      })
      sayingResult = checkReq.data[0].rs_q_saying;
      quoteType = checkReq.data[0].rs_q_type;
    }
    // REQUEST QUOTE RATINGS
    let ratingsReq = await axios.get("/api/ratings/get", { params: { id: checkReq.data[0].rs_q_id } })
    if (ratingsReq.data[0] === undefined) {
      ratingsReq.data[0] = { rs_rating: null }
    }
    // REQUEST QUOTE RATINGS BY THIS USER
    const myRatingReq = await axios.get("/api/myRating/get", { params: { quoteId: checkReq.data[0].rs_q_id, userId: user.id } })
    if (myRatingReq.data[0] === undefined) {
      myRatingReq.data[0] = { rs_rating: null }
    }
    const newQuotes = _.cloneDeep(this.state.quotes);
    let newQuote = _.cloneDeep(newQuotes[lastQuote])
    newQuote = {
      id: checkReq.data[0].rs_q_id,
      type: quoteType,
      saying: sayingResult,
      stars: ratingsReq.data[0].rs_rating,
      myStars: myRatingReq.data[0].rs_rating,
    }
    if (qNew === true) {
      for (let j = 0; j < newQuotes.length; j++) {
        if (newQuotes[j]['id'] === qId) {
          newQuotes[j] = newQuote
        }
      }
    } else {
      newQuotes.push(newQuote)
    }
    this.setState({
      quotes: newQuotes
    })

  }
  averageRatings = (arr) => {
    let count = 0;
    let ratingAvg = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr.length === 0) {
        return null;
      }
      ratingAvg += arr[i].rs_rating;
      count++
    }
    ratingAvg = Math.round(ratingAvg /= count)
    return ratingAvg
  }
  loadCards = () => {
    let { quotes } = this.state;
    // quotes = quotes.reverse()
    let quoteCards;
    let counter = -1;
    if (this.state.quotes.length === 0) {
      quoteCards = [<p key='1'>Press the button to get quotes!</p>]
    } else {
      quoteCards = quotes.map(item => {
        counter += 1;
        return <QuoteCard quote={item} value={counter} key={counter} starSelect={this.starSelect} starSubmit={this.starSubmit} />
      })
    }
    this.setState({
      quoteCards: quoteCards
    })
  }
  loadTypeBtns = () => {
    const { quoteType } = this.state;
    if (quoteType === null) {
      this.setState({ quoteType: 'medium' })
    }
    const { handleSelect } = this;
    const lengthBtns = [
      { id: 1, value: 'small' },
      { id: 2, value: 'medium' },
      { id: 3, value: 'large' }];
    const lengthButtons = lengthBtns.map(elem => {
      return <button key={elem.id} id={elem.id} value={elem.value} className={elem.value === quoteType ? 'btn' : 'btn-off'} onClick={handleSelect}>{elem.value}</button>
    })
    this.setState({ lengthButtons: lengthButtons })
  }
  starSelect = async (rating, id, qIndex) => {
    let postRating = await axios.post('/api/rating/post', {
      quoteId: id, rating: rating, userId: this.state.user.id
    })
    this.getAllQuoteInfo(true, postRating.data[0].rs_r_q_id, qIndex)
  }
  handleSelect = async (e) => {
    let value = e.target.value
    await this.setState({
      quoteType: value
    })
  }
  loopThruResults = (arr, type) => {
    let newArr = []
    for (let i = 0; i < arr.length; i++) {
      if (this.checkSize(arr[i], type)) {
        newArr.push(arr[i])
      }
    }
    if (newArr.length === 0) {
      return newArr
    } else {
      newArr = newArr[Math.floor(Math.random() * newArr.length)];
      return newArr;
    }
  }
  checkSize = (item, sizeType) => {
    let itemArr = item.split(' ')
    let size = itemArr.length;
    if (sizeType === 'small') {
      if (5 > size) {
        return true;
      }
    } else if (sizeType === 'medium') {
      if (12 >= size && size >= 5) {
        return true;
      }
    } else if (sizeType === 'large') {
      if (12 < size) {
        return true;
      }
    }
  }

  render() {
    const { quoteCards, lengthButtons } = this.state;
    return (
      <>
        <div className='main'>
          <div className='bg-img'>
          </div>
          <div className='title-section'>
            <h1 >Ron Swanson Says</h1>
            <div>{lengthButtons}</div>
            <button className='big-button' onClick={() => this.getAllQuoteInfo(false)}>Get a Quote</button>
          </div>
          <div className='card-container'>
            {quoteCards}
          </div>
        </div>
      </>
    );
  }
}

export default App;
