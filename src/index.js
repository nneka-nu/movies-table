import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import configureStore from './store';
import { fetchMovies } from './actions/actions';
import App from './App';
import HomePage from './components/HomePage';
import './style.css';

let store = configureStore();

store.dispatch(fetchMovies());

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={HomePage} />
        <Route path="*" component={HomePage} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
