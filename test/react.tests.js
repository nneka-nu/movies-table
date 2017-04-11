import React from 'react';
import { mount, shallow } from 'enzyme';
import expect from 'expect';
import sinon from 'sinon';

import Pagination from '../src/components/Pagination';
import { HomePage } from '../src/components/HomePage';
import { Modal } from '../src/components/Modal';
import { MoviesTable } from '../src/components/MoviesTable';
import { MovieRowData } from '../src/components/MovieRowData';
import Rating from '../src/components/Rating';

function setupPagination(currentPage = 2, numOfPages = 3) {
  const props = {
    currentPage,
    numOfPages,
    onSetCurrentPage: () => {}
  }

  return shallow(<Pagination {...props} />);
}

describe('Pagination Component', function() {
  it('should conclude that the current page\'s parent class "active"', function() {
    let currentPage = 3;
    let numOfPages = 4;
    const wrapper = setupPagination(currentPage, numOfPages);

    expect(wrapper.find('.active').length).toBe(1);
    expect(wrapper.find('#page-' + currentPage).at(0).parent().is('.active')).toBe(true)
  });

  it('should conclude that there\'s no previous («) page element/number (if currentPage === 1)', function() {
    let currentPage = 1;
    let numOfPages = 4;
    const wrapper = setupPagination(currentPage, numOfPages);

    expect(wrapper.find('li').first().is('.active')).toBe(true);
    expect(wrapper.find('li').first().childAt(0).is('#page-1')).toBe(true);
  });

  it('should conclude that the previous («) page number is currentPage minus 1 (if currentPage > 1)', function() {
    let currentPage = 2;
    let numOfPages = 4;
    const wrapper = setupPagination(currentPage, numOfPages);

    expect(wrapper.find('li').first().childAt(0).is('#page-' + (currentPage - 1))).toBe(true);
  });

  it('should conclude that the next (»)  page element/number does not exist (if currentPage === numOfPages)', function() {
    let currentPage = 4;
    let numOfPages = 4;
    const wrapper = setupPagination(currentPage, numOfPages);

    expect(wrapper.find('li').last().is('.active')).toBe(true);
    expect(wrapper.find('a').last().props().id).toBe('page-' + (currentPage));
  });

  it('should conclude that the next (»)  page number is currentPage plus 1 (if currentPage < numOfPages)', function() {
    let currentPage = 3;
    let numOfPages = 4;
    const wrapper = setupPagination(currentPage, numOfPages);

    expect(wrapper.find('a').last().props().id).toBe('page-' + (currentPage + 1))
  });

})


describe('HomePage Component', function() {
  const props = {
    movies: [
      {
        id: 1,
        title: 'BlasphemyMan and the Flip-Flopping Goons',
        genres: ['action', 'fantasy', 'crime', 'suspense'],
        releaseYear: 1994,
        rating: 5
      }
    ]
  }
  const wrapper = shallow(<HomePage {...props}/>);

  it('should change the displayModal state on simulate click', function() {
    expect(wrapper.state().displayModal).toBe(false)
    wrapper.find('#add-new').simulate('click');
    expect(wrapper.state().displayModal).toBe(true)
  })
});

describe('Modal Component', function() {
  const props = {
    display: false,
    clearRating: false,
    onClose: () => {},
    onSetCurrentPage: () => {}
  }
  const wrapper = shallow(<Modal {...props}/>);

  it('should receive props', function() {
    const spy = sinon.spy(Modal.prototype, 'componentWillReceiveProps');

    expect(spy.calledOnce).toBe(false);
    wrapper.setProps({ clearRating: true });
    expect(spy.calledOnce).toBe(true);
  });

  it('should set props and update clearRating state', function() {
    wrapper.setProps({ clearRating: true });
    expect(wrapper.state().clearRating).toBe(true);
    wrapper.setProps({ clearRating: false });
  });

  it('should test that changing an input text sets the form state', function() {
    const value = 'action, adventure';
    const event = { target: { name: 'genres', value } };

    wrapper.find('input').at(1).simulate('change', event);
    expect(wrapper.state().form.genres).toBe(value);
  });

  it('should test form validation on blur if the input has a value', function() {
    const event = { target: { name: 'genres', value: 'adventure' } };
    wrapper.instance().validateForm(event)
    expect(wrapper.state().errors.genres).toNotExist();
  });

  it('should test form validation on blur if the input does not have a value', function() {
    const event = { target: { name: 'genres', value: '' } };
    wrapper.instance().validateForm(event)
    expect(wrapper.state().errors.genres).toExist();
  });
  
});

describe('MoviesTable Component', function() {
  const props = {
    movies: [{}],
    moviesByPage: [{}]
  }
  const wrapper = shallow(<MoviesTable {...props}/>);

  it('should receive props', function() {
    const spy = sinon.spy(MoviesTable.prototype, 'componentWillReceiveProps');

    expect(spy.calledOnce).toBe(false);
    wrapper.setProps({ movies: [{id: 7}] });
    expect(spy.calledOnce).toBe(true);
  });
});

describe('MovieRowData Component', function() {
  const props = {
    movie: {
      id: 2,
      title: 'Tip Jar 2: The Tippening',
      genres: ['drama', 'horror'],
      releaseYear: 1978,
      rating: 4
    },
    onDelete: () => {}
  }
  const wrapper = shallow(<MovieRowData {...props}/>);

  it('should render correctly', function() {
    expect(wrapper.find('tr').length).toBe(1);
    expect(wrapper.find('.table-stars').length).toBe(1);
    expect(wrapper.find('.edit').length).toBe(1);
    expect(wrapper.find('.delete').length).toBe(1);
  });
});

describe('Rating Component', function() {
  const props = {
    movieId: 1,
    placement: 'inline',
    value: 4,
    clearRating: true,
    onSetRatingState: () => {},
    onValidateRating: () => {}
  }
  const wrapper = shallow(<Rating {...props}/>);

  it('should receive props and update rating state', function() {
    const spy = sinon.spy(Rating.prototype, 'componentWillReceiveProps');

    expect(spy.calledOnce).toBe(false);
    wrapper.setProps({ clearRating: false });
    expect(spy.calledOnce).toBe(true);
    expect(wrapper.state().rating).toBe(props.value);
    Rating.prototype.componentWillReceiveProps.restore();
  });

  it('should show the correct number of active stars', function() {
    expect(wrapper.find('.active').length).toBe(props.value)
  });
});