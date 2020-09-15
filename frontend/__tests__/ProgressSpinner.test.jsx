import React from 'react';
import { shallow } from 'enzyme';
import ProgressSpinner from '../src/ProgressSpinner';

describe('ProgressSpinner', () => {
  test('first element should be div', () => {
    expect(shallow(<ProgressSpinner />).type()).toBe('div');
  });

  test('first element class should be lds-roller', () => {
    expect(shallow(<ProgressSpinner />).props().className).toEqual(
      'lds-roller'
    );
  });

  test('snapshot matching', () => {
    expect(shallow(<ProgressSpinner />)).toMatchSnapshot();
  });
});
