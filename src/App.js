import React, { Component } from 'react';
import axios from 'axios';

import './App.scss';
import QuoteCard from './QuoteCards/QuoteCard'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      quotes: [],
      quotesTemp: [],
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
      if (prevState.quotes[lastQuote]['stars'] !== this.state.quotes[lastQuote]['stars']
        || prevState.quotes[lastQuote]['myStars'] !== this.state.quotes[lastQuote]['myStars']) {
        this.loadCards();
      }
    } else if (prevState.quoteType !== this.state.quoteType) {
      this.loadTypeBtns()
    }
  }
  checkVisitor = () => {
    axios.get("/api/visitor/check")
      .then(res => {
        console.log('res.data', res.data)
        if (res.data === '') {
          console.log('no user found');
          this.registerVisitor()
        }
      })
      .catch(err => console.log('error at checkVisitor', err))
  }
  registerVisitor = () => {
    axios.post("/api/visitor/register", { A: 'ok' })
      .then(res => {
        console.log('res.data', res.data)
        this.setState({ user: res.data })
      })
      .catch(err => console.log('error at registerVisitor', err))
  }
  getQuotes = () => {
    console.log('App.js, getQuotes fn')
    const { quoteType } = this.state;
    let newList = this.state.quotes;
    axios.get('https://ron-swanson-quotes.herokuapp.com/v2/quotes/58')
      .then(async res => {
        // console.log('res.data', res.data)
        console.log('this.loopThruResults(res.data, quoteType).length === 0', this.loopThruResults(res.data, quoteType).length === 0)
        if (this.loopThruResults(res.data, quoteType).length === 0) {
          await this.setState({ warning: `No quotes of ${quoteType} size found!` })
          setTimeout(() => { this.setState({ warning: '' }) }, 2000)
          console.log('no quotes found!')
        } else {
          let result = this.loopThruResults(res.data, quoteType)
          newList.push({ id: null, type: quoteType, saying: result, stars: null, myStars: null })
          await this.setState({ quotes: newList });
        }
        await this.loadCards();
        this.checkQuote()
      })
      .catch(err => console.log('error at getQuotes', err))
  }
  checkQuote = () => {
    if (this.state.quotes.length !== 0) {
      const lastQuote = this.state.quotes.length - 1;
      const quote = this.state.quotes[lastQuote];
      console.log('starting checkQuote, quote:', quote)
      axios.get('/api/quote/check', {
        params: { saying: quote.saying, type: quote.type }
      })
        .then(async response => {
          // returns entire quote object, including stars
          console.log('check quote response', response.data[0])
          if (response.data[0] === undefined) {
            console.log('checkQuote found no matches')
            this.registerQuote(quote)
          } else {
            console.log('checkQuote found a match, updating state')
            const newQuotes = this.state.quotes;
            const { rs_q_id, rs_q_saying, rs_q_type } = response.data[0];
            newQuotes[lastQuote] = { id: rs_q_id, type: rs_q_type, saying: rs_q_saying, stars: null, myStars: null }
            await this.setState({ quotes: newQuotes })
            this.loadCards();
            console.log('App.js, checkQuote complete, response:', newQuotes[lastQuote])
          }
        }).catch(error => {
          console.log('App.js, checkQuote fail', error)
        });
    }
  }
  registerQuote = (q) => {
    console.log('starting registerQuote')
    const lastQuote = this.state.quotes.length - 1;
    axios.post('/api/quote/register', {
      saying: q.saying, type: q.type
    }).then(async response => {
      console.log('App.js, registerQuote complete, response:', response.data[0])
      const { rs_q_id, rs_q_saying, rs_q_type } = response.data[0]
      const newQuotes = this.state.quotes;
      newQuotes[lastQuote] = { id: rs_q_id, saying: rs_q_saying, type: rs_q_type, stars: null, myStars: null }
      await this.setState({ quotes: newQuotes })
      this.loadCards();
    }).catch(error => {
      console.log('App.js, registerQuote fail', error)
    });
  }

  starSelect = (rating, index) => {
    let newList = this.state.quotes;
    console.log('STAR SELECT')
    console.log(`changeRating, ${newList[index]['saying']}, newList[index]['myStars']`, newList[index]['myStars'])
    newList[index]['myStars'] = rating;
    console.log(`changeRating, ${newList[index]['saying']}, newList[index]['myStars']`, newList[index]['myStars'])
    this.setState({ quotesTemp: newList })
  }
  starSubmit = () => {
    this.setState({ quotes: this.state.quotesTemp, quotesTemp: [] })
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
  handleSelect = async (e) => {
    let value = e.target.value
    await this.setState({
      quoteType: value
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

  loopThruResults = (array, type) => {
    let newArr = []
    for (let i = 0; i < array.length; i++) {
      if (this.checkSize(array[i], type)) {
        newArr.push(array[i])
      }
    }
    // console.log(newArr);
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
    const { quotes, quotesTemp, quoteCards, lengthButtons, quoteType, warning } = this.state;
    console.log('render console, warning:', warning);
    console.log('render console, quotes:', quotes);
    console.log('render console, quotesTemp:', quotesTemp);
    console.log('render console, quoteType:', quoteType);
    return (
      <div className="vert-rule hor-rule mrgn-t5">

        <section className='vert-rule-sect hor-rule-sect'>
          <h1>Ron Swanson Quotes</h1>
          <button onClick={this.getQuotes}>Get a Quote</button>
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
