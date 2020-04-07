import React from 'react';
import { shallow } from 'enzyme';
import App from '../src/App';

describe('App', () => {
  test('renders without crashing', () => {
    shallow(<App />);
  });

  test('first element must be div', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.first().type()).toBe('div');
  });

  test('first element default color is red', () => {
    const wrapper = shallow(<App />);
    console.log(wrapper.first().get(0).props.style)
    expect(wrapper.first().get(0).props.style).toBe('background-color: red');
  });
});
