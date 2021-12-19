import React from 'react';
import { shallow } from 'enzyme';
import FailedItem from '../src/FailedItem';
import ProgressSpinner from '../src/ProgressSpinner';

describe('FailedItem', () => {
  test('renders without crashing', () => {
    shallow(<FailedItem />);
  });

  test('display name render as text', () => {
    expect(
      shallow(<FailedItem displayName="Some display test" />).html()
    ).toMatchSnapshot();
  });

  test('display name with href render as link', () => {
    expect(
      shallow(
        <FailedItem
          displayName="Some display test"
          href="http://localhost/href"
        />
      ).html()
    ).toMatchSnapshot();
  });

  test('no running - no progress spinner', () => {
    const wrapper = shallow(<FailedItem />);
    expect(wrapper.find(ProgressSpinner)).toHaveLength(0);
  });

  test('running - have one progress spinner', () => {
    const wrapper = shallow(<FailedItem running={true} />);
    expect(wrapper.find(ProgressSpinner)).toHaveLength(1);
  });
});
