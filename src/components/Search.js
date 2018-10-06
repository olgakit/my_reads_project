import React from 'react';
import { Link } from 'react-router-dom';
import * as BooksAPI from '../BooksAPI';
import Book from './Book';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
      results: [],
      query: ""
    }
  }

  componentDidMount() {
    BooksAPI.getAll()
    .then(x => {
      this.setState({ books: x })
    });
  }

  updateSearch = (query) => {
    this.setState({query: query}, this.submitSearch);
  }

  submitSearch() {
    if(this.state.query === "" || this.state.query === undefined) {
      return this.setState({results: []});
    } 
    BooksAPI.search(this.state.query.trim()).then(show => {
      if(show.error) {
        return this.setState({results: []});
      } else {
        show.forEach(b => {
          let f = this.state.books.filter(fb => fb.id === b.id);
          b.shelf = f[0] ? f.shelf : null;
          if(f[0]) {
            b.shelf = f[0].shelf;
          }
        });
        return this.setState({results: show});
      }
    });
  }

  assignShelf = (book, shelf) => {
    BooksAPI.update(book, shelf)
    .then(x => {
      book.shelf = shelf;
      this.setState(state => ({
        books: state.books.filter(b => b.id !== book.id).concat([book])
      }));
    });
  }

  render() {
    return(
      <div className="search-books">
        <div className="search-books-bar">
          <Link className="close-search" to="/">Close</Link>
          <div className="search-books-input-wrapper">
            <input type="text" placeholder="Search by title or author" value={this.state.query}
              onChange={(event) => this.updateSearch(event.target.value)} />

          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">
            {
              this.state.results.map((book, key) => <Book assignShelf={this.assignShelf} key={key} book={book} /> )
            }
          </ol>
        </div>
      </div>
    );
  }
}


export default Search;