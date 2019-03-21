import React, { Component } from 'react';
import axios from 'axios';

import './App.scss';
import QuoteCard from './QuoteCards/QuoteCard'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      quotes: [],
      quoteType: 'medium',
      quoteCards: [],
      lengthButtons: [],
    }
  }
  componentDidMount = () => {
    // this.getQuotes();
  }
  componentDidUpdate = () => {

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
      })
      .catch(err => console.log('error at getQuotes', err))
  }
  checkQuote = () => {
    const { saying } = this.state.quotes;
    // if (quotes.length !== 0) {
    // for (let i = 0; i < quotes.length; i++) {
    // if (quotes[quotes.length-1] === null)
    axios.get('/api/quote/check', {
      saying: saying
    }).then(response => {
      // returns entire quote object, including stars
      console.log('App.js, checkQuote complete, response:', response)
    }).catch(error => {
      console.log('App.js, checkQuote fail', error)
    });
    // }
    // }
  }
  registerQuote = () => {
    const { quotes } = this.state;
    if (quotes.length !== 0) {
      axios.post('/api/quote/register', {
        quotes: quotes
      }).then(response => {
        console.log('App.js, registerQuote complete, response:', response)
      }).catch(error => {
        console.log('App.js, registerQuote fail', error)
      });
    }
  }
  loadCards = () => {
    let quoteCards;
    if (this.state.quotes.length === 0) {
      quoteCards = [<p>Press the button to get quotes!</p>]
    } else {
      quoteCards = this.state.quotes.map(item => {
        return <QuoteCard quote={item} />
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
    const { quoteCards } = this.state;
    console.log(quoteCards);
    return (
      <div className="vert-rule hor-rule mrgn-t15">
        <section class='vert-rule-sect hor-rule-sect'>
          <h1>Ron Swanson Quotes</h1>
          <button onClick={this.getQuotes}>Get a Quote</button>
        </section>
        <section class='vert-rule-sect hor-rule-sect flex-row flex-wrap'>

          {quoteCards}

        </section>
      </div >
    );
  }
}

export default App;
