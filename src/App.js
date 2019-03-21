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
        || prevState.quotes[lastQuote]['myStars'] !== this.state.quotes[lastQuote]['myStars']
        || prevState.quotes[lastQuote]['id'] !== this.state.quotes[lastQuote]['id']) {
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
          newList.push({ id: null, type: quoteType, saying: res.data[0], stars: null, myStars: null })
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
        .then(response => {
          // returns entire quote object, including stars
          if (response[0] === undefined) {
            console.log('checkQuote found no matches')
            this.registerQuote(quote)
          } else {
            console.log('checkQuote found a matches, updating state')
            const newQuotes = this.state.quotes;
            newQuotes[lastQuote] = response[0]
            this.setState({ quotes: newQuotes })
            console.log('App.js, checkQuote complete, response:', response[0])
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
  loadCards = () => {
    let quoteCards;
    let counter = 0;
    if (this.state.quotes.length === 0) {
      quoteCards = [<p key='1'>Press the button to get quotes!</p>]
    } else {
      quoteCards = this.state.quotes.map(item => {
        counter += 1;
        console.log('loadCards, item:', item)
        return <QuoteCard quote={item} key={counter} />
      })
    }
    this.setState({
      quoteCards: quoteCards
    })
  }
  handleSelect = async (e) => {
    // let id = e.target.id
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
      newArr = newArr[Math.floor(Math.random() * newArr.length)];
      return newArr;
    }
  }
  checkSize = (item, sizeType) => {
    // console.log('item', item)
    let size = item.length;
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
    const { quotes, quoteCards, lengthButtons, quoteType, warning } = this.state;
    console.log('render console, warning:', warning);
    console.log('render console, quotes:', quotes);
    // console.log('render console, quoteType:', quoteType);
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
