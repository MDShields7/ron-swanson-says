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
      quotesTemp: [],
      indexList: [],
      quoteType: 'medium',
      quoteCards: [],
      lengthButtons: [],
      warning: ''
    }
  }
  componentDidMount = () => {
    this.checkVisitor()
    this.loadTypeBtns()
  }
  componentDidUpdate = (prevProps, prevState) => {
    const lastQuote = this.state.quotes.length - 1;
    if (this.state.quotes[lastQuote] !== undefined) {
      if (prevState.quotes[lastQuote] !== this.state.quotes[lastQuote]) {
        this.loadCards();
      }
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
  getAllQuoteInfo = async () => {
    const { quoteType, user } = this.state;
    const lastQuote = this.state.quotes.length - 1;
    // REQUEST QUOTES
    const quotesReq = await axios.get('https://ron-swanson-quotes.herokuapp.com/v2/quotes/58')
    let loopResult = this.loopThruResults(quotesReq.data, quoteType)
    // CHECK IF QUOTE IS ON FILE, GET ID ( OR REGISTER, GET ID )
    let checkReq = await axios.get('/api/quote/check', {
      params: { saying: loopResult, type: quoteType }
    })
    if (checkReq.data[0] === undefined) {
      checkReq = await axios.post('/api/quote/register', {
        saying: loopResult, type: quoteType
      })
    }
    // REQUEST QUOTE RATINGS
    let ratingsReq = await axios.get("/api/ratings/get", { params: { id: checkReq.data[0].rs_q_id } })
    if (ratingsReq.data[0] === undefined) {
      ratingsReq.data[0] = null
    }
    // REQUEST QUOTE RATINGS BY THIS USER
    const myRatingsReq = await axios.get("/api/ratings/get", { params: { id: checkReq.data[0].rs_q_id, userId: user.id } })
    if (myRatingsReq.data[0] === undefined) {
      myRatingsReq.data[0] = null
    }
    const newQuotes = _.cloneDeep(this.state.quotes);
    let newQuote = _.cloneDeep(newQuotes[lastQuote])
    newQuote = {
      id: checkReq.data[0].rs_q_id,
      type: quoteType,
      saying: loopResult,
      stars: ratingsReq.data[0],
      myStars: myRatingsReq.data[0],
    }
    newQuotes.push(newQuote)
    console.log('newQuote', newQuote)
    this.setState({
      quotes: newQuotes
    })

  }
  // getQuotes = () => {
  //   console.log('App.js, getQuotes fn')
  //   let result;
  //   const { quoteType } = this.state;
  //   let newList = _.cloneDeep(this.state.quotes);
  //   axios.get('https://ron-swanson-quotes.herokuapp.com/v2/quotes/58')
  //     .then(res => {
  //       console.log('res', res)
  //       let loopResult = this.loopThruResults(res.data, quoteType)
  //       result = { type: quoteType, saying: loopResult }
  //       console.log('getQuotes, result', result)
  //       newList.push({ id: null, type: quoteType, saying: loopResult, stars: null, myStars: null })
  //       console.log('GET QUOTES, newList', result)
  //       // await this.setState({ quotes: newList });

  //     })
  //     // .then(() => {
  //     //   this.loadCards();
  //     // })
  //     .catch(err => console.log('error at getQuotes', err))
  //   console.log('getQuotes, result', result)
  //   return result;
  // }
  // checkQuote = () => {
  //   if (this.state.quotes.length !== 0) {
  //     const lastQuote = this.state.quotes.length - 1;
  //     const quote = this.state.quotes[lastQuote];
  //     console.log('App.js checkQuote start, quote:', quote)
  //     axios.get('/api/quote/check', {
  //       params: { saying: quote.saying, type: quote.type }
  //     })
  //       .then(async response => {
  //         // returns entire quote object, including stars
  //         console.log('App.js checkQuote, response', response.data[0])
  //         if (response.data[0] === undefined) {
  //           console.log('checkQuote found no matches')
  //           return this.registerQuote(quote)
  //         } else {
  //           console.log('checkQuote found a match, updating state')
  //           const newQuotes = _.cloneDeep(this.state.quotes);
  //           const { rs_q_id, rs_q_saying, rs_q_type } = response.data[0];
  //           newQuotes[lastQuote] = { id: rs_q_id, type: rs_q_type, saying: rs_q_saying, stars: null, myStars: null }
  //           // await this.setState({ quotes: newQuotes })
  //           // this.loadCards();
  //           console.log('App.js, checkQuote complete, response:', newQuotes[lastQuote])
  //           let result = { id: rs_q_id }
  //           console.log('CHECK QUOTE, result', result)
  //           return result
  //         }
  //       }).catch(error => {
  //         console.log('App.js, checkQuote fail', error)
  //       });
  //   }
  // }
  // registerQuote = (q) => {
  //   console.log('starting registerQuote')
  //   const lastQuote = this.state.quotes.length - 1;
  //   axios.post('/api/quote/register', {
  //     saying: q.saying, type: q.type
  //   }).then(async response => {
  //     console.log('App.js, registerQuote complete, response:', response.data[0])
  //     const { rs_q_id, rs_q_saying, rs_q_type } = response.data[0]
  //     const newQuotes = _.cloneDeep(this.state.quotes);
  //     newQuotes[lastQuote] = { id: rs_q_id, saying: rs_q_saying, type: rs_q_type, stars: null, myStars: null }
  //     // await this.setState({ quotes: newQuotes })
  //     // this.loadCards();
  //     let result = { id: rs_q_id }
  //     return result;
  //   }).catch(error => {
  //     console.log('App.js, registerQuote fail', error)
  //   });
  // }
  // getMyRatings = () => {
  //   if (this.state.quotes.length !== 0) {
  //     const lastQuote = this.state.quotes.length - 1;
  //     const quote = this.state.quotes[lastQuote];
  //     console.log('App.js getMyRatings start, quote.id:', quote.id)
  //     axios.get("/api/ratings/get", { params: { id: quote.id } })
  //       .then(async res => {
  //         console.log('App.js getMyRatings, res.data', res.data)
  //         let newQuotes = _.cloneDeep(this.state.quotes);
  //         let result = { myStars: res.data[0] }
  //         if (res.data.length === 0) {
  //           result = { myStars: 'not rated' }
  //         }
  //         newQuotes[lastQuote]['myStars'] = res.data[0];
  //         // await this.setState({ quotes: newQuotes })
  //         // this.loadCards()
  //         return result
  //       })
  //       .catch(err => console.log('error at checkVisitor', err))
  //   }
  // }
  // getRatings = () => {
  //   let ratings;
  //   if (this.state.quotes.length !== 0) {
  //     const lastQuote = this.state.quotes.length - 1;
  //     const quote = this.state.quotes[lastQuote];
  //     console.log('App,js getRatings start, quote.id:', quote)
  //     axios.get("/api/ratings/get", { params: { id: quote.id } })
  //       .then(async res => {
  //         console.log('App,js getRatings, res.data', res.data)
  //         let result = this.averageRatings(res.data)
  //         console.log('ratings', ratings)
  //         let newQuotes = _.cloneDeep(this.state.quotes);
  //         newQuotes[lastQuote]['stars'] = ratings;
  //         // await this.setState({ quotes: newQuotes })
  //         // this.loadCards()
  //         return result;
  //       })
  //       .catch(err => console.log('error at checkVisitor', err))
  //   }
  // }
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
  starSelect = async (rating, index) => {
    let newList = _.cloneDeep(this.state.quotes);
    newList[index]['myStars'] = rating;
    let newIndexList = _.cloneDeep(this.state.indexList);
    newIndexList.push(index);
    console.log('indexList', newIndexList);
    await this.setState({ quotesTemp: newList, indexList: newIndexList })
    console.log('App.js, submit stars rating')
    this.setState({ quotes: this.state.quotesTemp, quotesTemp: [] })
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
          <button onClick={this.getAllQuoteInfo}>Get a Quote</button>
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
