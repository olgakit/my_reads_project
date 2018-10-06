import React from 'react';
import { Link } from 'react-router-dom';
import * as BooksAPI from '../BooksAPI';
// import Book from './Book';
import Shelf from './Shelf';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      books: []
    }
  }

  componentDidMount() {
    BooksAPI.getAll()
    .then(x => {
      this.setState({ books: x })
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
      <div className="list-books">
      <div className="list-books-title">
        <h1>MyReads</h1>
      </div>
      <div className="list-books-content">
        <div>
          <Shelf assignShelf={this.assignShelf} name="Currently Reading" books={this.state.books.filter(b => b.shelf === "currentlyReading")}/>
          <Shelf assignShelf={this.assignShelf} name="Want to Read" books={this.state.books.filter(b => b.shelf === "wantToRead")}/>
          <Shelf assignShelf={this.assignShelf} name="Read" books={this.state.books.filter(b => b.shelf === "read")}/> 
        </div>
      </div>
      <div className="open-search">
        <Link to="/Search">Add a book</Link>
      </div>
    </div>
    );
  }
}

export default Home;