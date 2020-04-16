import React from 'react';
import { shallow } from 'enzyme';
import FailedItem from '../src/FailedItem';

describe('FailedItem', () => {
  test('renders without crashing', () => {
    shallow(<FailedItem />);
  });

  test('display name render as text', () => {
    expect(
      shallow(<FailedItem displayName="Some display test" />).text()
    ).toEqual('Some display test');
  });
});
