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
    }
  }
  componentDidMount = () => {
    this.checkVisitor()
  }
  componentDidUpdate = (prevProps, prevState) => {
    const lastQuote = this.state.quotes.length - 1;
    if (this.state.quotes[lastQuote] !== undefined) {
      if (prevState.quotes[lastQuote]['stars'] !== this.state.quotes[lastQuote]['stars'] || prevState.quotes[lastQuote]['myStars'] !== this.state.quotes[lastQuote]['myStars']) {
        this.loadCards();
      }
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
    axios.get('https://ron-swanson-quotes.herokuapp.com/v2/quotes/2')
      .then(async res => {
        console.log(res.data[0])
        let newList = this.state.quotes;
        newList.push({ id: null, type: quoteType, saying: res.data[0], stars: null, myStars: null })
        await this.setState({ quotes: newList });
        this.loadCards();
        this.checkQuote()
      })
      .catch(err => console.log('error at getQuotes', err))
  }
  checkQuote = () => {
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
  registerQuote = (q) => {
    console.log('starting registerQuote')
    axios.post('/api/quote/register', {
      saying: q.saying, type: q.type
    }).then(response => {
      console.log('App.js, registerQuote complete, response:', response)
    }).catch(error => {
      console.log('App.js, registerQuote fail', error)
    });
  }
  loadCards = () => {
    let quoteCards;
    let counter = 0;
    if (this.state.quotes.length === 0) {
      quoteCards = [<p>Press the button to get quotes!</p>]
    } else {
      quoteCards = this.state.quotes.map(item => {
        counter += 1;
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
      quoteType: this.props[value]
    })
  }
  loadQuoteType = () => {
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
      return <button key={elem.id} id={elem.id} value={elem.value} className={elem.id === quoteType ? 'btn' : 'btn-off'} onClick={handleSelect}>{elem.value}</button>
    })
    this.setState({ lengthButtons: lengthButtons })
  }

  render() {
    const { quotes, quoteCards } = this.state;
    console.log('render console, quotes:', quotes);
    return (
      <div className="vert-rule hor-rule mrgn-t5">

        <section className='vert-rule-sect hor-rule-sect'>
          <h1>Ron Swanson Quotes</h1>
          <button onClick={this.getQuotes}>Get a Quote</button>
        </section>
        <section className='vert-rule-sect hor-rule-sect flex-row flex-wrap space-between'>

          {quoteCards}

        </section>
      </div >
    );
  }
}

export default App;
