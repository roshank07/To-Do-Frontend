import React, { Component } from 'react';
import styles from './ArticleEditor.module.css'; // Import CSS Modules
import backend from './process';

class ArticleEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      article: '',
      savedArticles: [],
    };
  }

  componentDidMount() {
    // Fetch saved articles from the server when the component mounts
    this.fetchSavedArticles();
  }

  fetchSavedArticles = () => {
    fetch(`${backend.url}/api/savedArticles`)
      .then((response) => response.json())
      .then((data) => this.setState({ savedArticles: data }))
      .catch((error) => console.error('Error fetching saved articles:', error));
  };

  handleArticleChange = (e) => {
    this.setState({ article: e.target.value });
  };

  handleSaveArticle = (e) => {
    e.preventDefault();

    fetch(`${backend.url}/api/savedArticles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ article: this.state.article }),
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({ savedArticles: data, article: '' });
      })
      .catch((error) => console.error('Error saving article:', error));
  };

  handleDeleteArticle = (index) => {
    fetch(`${backend.url}/api/savedArticles/${index}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({ savedArticles: data });
      })
      .catch((error) => console.error('Error deleting article:', error));
  };
  

  render() {
    return (
        <div className={styles['article-editor-container']}>
            <header className={styles['app-header']}>
                <h1>To do list</h1>
            </header>
        <form onSubmit={this.handleSaveArticle} className={styles['article-form']}>
          <label>
            <textarea
              value={this.state.article}
              onChange={this.handleArticleChange}
              placeholder="Type your article here..."
              rows="4"
              cols="50"
            />
          </label>
          <br />
          <button type="submit">Save Article</button>
        </form>
        <div className={styles['saved-articles-container']}>
          <h2>Saved Articles</h2>
          <ul className={styles['saved-articles-list']}>
            {this.state.savedArticles.map((savedArticle, index) => (
              <li key={index} className={styles['saved-article-item']}>
                {savedArticle}
                <button onClick={() => this.handleDeleteArticle(index)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default ArticleEditor;
