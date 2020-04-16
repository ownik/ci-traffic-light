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

  test('check display items', () => {
    const items = [
      { displayName: 'item1' },
      { displayName: 'item2' },
      { displayName: 'item3' },
    ];
    const wrapper = shallow(<FailedItemList items={items} />);
    expect(wrapper.find(FailedItem)).toHaveLength(items.length);
    wrapper.find(FailedItem).forEach((item, index) => {
      expect(item.dive().text()).toEqual(items[index].displayName);
    });
  });
});
