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
      // quotesTemp: [],
      indexList: [],
      quoteType: 'medium',
      quoteCards: [],
      lengthButtons: [],
      // warning: ''
    }
  }
  componentDidMount = () => {
    this.checkVisitor()
    this.loadTypeBtns()
  }
  componentDidUpdate = (prevProps, prevState) => {
    const lastQuote = this.state.quotes.length - 1;
    if (_.isEqual(this.state.quotes, prevState.quotes) === false) {
      this.loadCards();
    } else if (prevState.quoteType !== this.state.quoteType) {
      this.loadTypeBtns()
    }
  }
  checkVisitor = () => {
    axios.get("/api/visitor/check")
      .then(res => {
        console.log('checkVisitor, res.data', res.data)
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
      console.log('CASE 1')
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
      console.log('CASE 2')
      checkReq = await axios.get('/api/quote/getById', {
        params: { id: qId }
      })
      sayingResult = checkReq.data[0].rs_q_saying;
      quoteType = checkReq.data[0].rs_q_type;
    }
    // REQUEST QUOTE RATINGS
    let ratingsReq = await axios.get("/api/ratings/get", { params: { id: checkReq.data[0].rs_q_id } })
    console.log('ratingsReq.data', ratingsReq.data)
    if (ratingsReq.data[0] === undefined) {
      ratingsReq.data[0] = { rs_rating: null }
    }
    // REQUEST QUOTE RATINGS BY THIS USER
    console.log('myRatingReq, checkReq.data[0].rs_q_id', checkReq.data[0].rs_q_id, 'user.id', user.id)
    const myRatingReq = await axios.get("/api/myRating/get", { params: { quoteId: checkReq.data[0].rs_q_id, userId: user.id } })
    console.log('myRatingReq.data', myRatingReq.data)
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
    console.log('newQuote', newQuote)
    if (qNew === true) {
      // newQuotes[qIndex] = newQuote
      for (let j = 0; j < newQuotes.length; j++) {
        if (newQuotes[j]['id'] === qId) {
          newQuotes[j] = newQuote
        }
      }
    } else {
      newQuotes.push(newQuote)
    }
    // console.log('newQuote', newQuote)
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
      console.log('arr[i].rs_rating', arr[i].rs_rating)
      ratingAvg += arr[i].rs_rating;
      count++
    }
    ratingAvg = Math.round(ratingAvg /= count)
    return ratingAvg
  }
  loadCards = () => {
    let quoteCards;
    let counter = -1;
    if (this.state.quotes.length === 0) {
      quoteCards = [<p key='1'>Press the button to get quotes!</p>]
    } else {
      quoteCards = this.state.quotes.map(item => {
        console.log('loadCards, item:', item)
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
    console.log('App.js, submit stars rating')
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
      console.log('newArr:', newArr, 'size:', type)
      newArr = newArr[Math.floor(Math.random() * newArr.length)];
      console.log('newArr:', newArr, 'size:', type)
      return newArr;
    }
  }
  checkSize = (item, sizeType) => {
    console.log('item', item)
    let itemArr = item.split(' ')
    console.log('itemArr', itemArr)
    let size = itemArr.length;
    console.log('size', size)
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
    const { quoteCards, lengthButtons, warning } = this.state;
    console.log('App.js render console, this.state:', this.state);
    return (
      <div className="vert-rule hor-rule mrgn-t5">

        <section className='vert-rule-sect hor-rule-sect'>
          <button onClick={this.getRatings} >Get Ratings for ID #1</button>
          <h1>Ron Swanson Quotes</h1>
          <button onClick={() => this.getAllQuoteInfo(false)}>Get a Quote</button>
          <div>{lengthButtons}</div>
          <p className='warning'>{warning}</p>
        </section>
        <section className='vert-rule-sect hor-rule-sect flex-row flex-wrap space-between'>
          {quoteCards}
        </section>
      </div >
    );
  }
}

export default App;
