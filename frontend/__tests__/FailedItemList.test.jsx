import React from 'react';
import { shallow } from 'enzyme';
import FailedItemList from '../src/FailedItemList';
import FailedItem from '../src/FailedItem';

describe('FailedItemList', () => {
  test('renders without crashing', () => {
    shallow(<FailedItemList />);
  });

  test('check className', () => {
    expect(shallow(<FailedItemList />).props()).toHaveProperty(
      'className',
      'failed-item-list'
    );
  });

  const items = [
    { displayName: 'item1', href: 'testhref1' },
    { displayName: 'item2', href: 'testhref2' },
    { displayName: 'item3' },
  ];

  test('check display items', () => {
    const wrapper = shallow(<FailedItemList items={items} />);
    expect(wrapper.find(FailedItem)).toHaveLength(items.length);
    let actual = [];
    wrapper.find(FailedItem).forEach((item) => {
      actual.push(item.props());
    });
    expect(actual).toStrictEqual([
      { displayName: 'item1', href: 'testhref1' },
      { displayName: 'item2', href: 'testhref2' },
      { displayName: 'item3', href: '' },
    ]);
  });

  test('check display items snapshot', () => {
    const wrapper = shallow(<FailedItemList items={items} />);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
