import React, { Component } from 'react';
import axios from 'axios';

import './App.scss';
import QuoteCard from './QuoteCards/QuoteCard'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      quotes: [],
      type: 'medium'
    }
  }
  componentDidMount = () => {
    // this.getQuotes();
  }
  componentDidUpdate = () => {

  }
  getQuotes = () => {
    console.log('App.js, getQuotes fn')
    const { type } = this.state;
    axios.get('https://ron-swanson-quotes.herokuapp.com/v2/1')
      .then(res => {
        let newList = this.state.quotes;
        newList.push({ id: null, type: type, saying: res[0], stars: null, myStars: null })
        this.setState({ quotes: newList });
      })
      .catch(err => console.log('error at getQuotes', err))
  }
  registerQuotes = () => {
    const { quotes } = this.state;
    if (quotes.length !== 0) {
      for (let i = 0; i < quotes.length; i++) {
        if (quotes[i]["id"] === null)
          axios.post('/api/registerQuotes', {
            quotes: quotes
          }).then(response => {
            console.log('HLogin.js, register user complete:', response)
          }).catch(error => {
            console.log('HLogin.js, register user fail:', error)
          });
      }
    }
  }

  render() {
    const quoteCards = this.quotes.map(item => {
      return <QuoteCard quote={item} />
    })
    return (
      <div className="vert-rule hor-rule mrgn-t15">
        <section>
          <h1>Ron Swanson Quotes</h1>
        </section>
        <section>
          <button>Get a Quote</button>
          <div>
            {quoteCards}
          </div>
        </section>
      </div >
    );
  }
}

export default App;
