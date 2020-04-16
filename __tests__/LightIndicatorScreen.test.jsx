import React from 'react';
import { shallow } from 'enzyme';
import LightIndicatorScreen from '../src/LightIndicatorScreen';
import FailedItemList from '../src/FailedItemList';
import FailedItem from '../src/FailedItem';

describe('LightIndicatorScreen', () => {
  test('renders without crashing', () => {
    shallow(<LightIndicatorScreen />);
  });

  test('first element must be div', () => {
    const wrapper = shallow(<LightIndicatorScreen />);
    expect(wrapper.type()).toBe('div');
  });

  const colors = { fail: 'red', success: 'green' };

  test('check colors props - default state', () => {
    const wrapper = shallow(<LightIndicatorScreen color={colors} />);
    expect(wrapper.get(0).props.style).toHaveProperty('backgroundColor', 'red');
  });

  test('check colors props - fail state', () => {
    const wrapper = shallow(
      <LightIndicatorScreen color={colors} state="fail" />
    );
    expect(wrapper.get(0).props.style).toHaveProperty('backgroundColor', 'red');
  });

  test('check colors props - success state', () => {
    const wrapper = shallow(
      <LightIndicatorScreen color={colors} state="success" />
    );
    expect(wrapper.get(0).props.style).toHaveProperty(
      'backgroundColor',
      'green'
    );
  });

  test('correct render children', () => {
    const MockContainer = () => <div></div>;
    const wrapper = shallow(
      <LightIndicatorScreen>
        <MockContainer />
      </LightIndicatorScreen>
    );
    expect(wrapper.find(MockContainer)).toHaveLength(1);
  });

  test('className for fail state', () => {
    const wrapper = shallow(<LightIndicatorScreen state="fail" />);
    expect(wrapper.props()).toHaveProperty(
      'className',
      'indicator-screen fail'
    );
  });

  test('className for success state', () => {
    const wrapper = shallow(<LightIndicatorScreen state="success" />);
    expect(wrapper.props()).toHaveProperty(
      'className',
      'indicator-screen success'
    );
  });

  test('FailedItemList visible on fail state', () => {
    const wrapper = shallow(<LightIndicatorScreen state="fail" />);
    expect(wrapper.find(FailedItemList)).toHaveLength(1);
  });

  test('FailedItemList invisible on success state', () => {
    const wrapper = shallow(<LightIndicatorScreen state="success" />);
    expect(wrapper.find(FailedItemList)).toHaveLength(0);
  });

  test('FailedItemList visible on fail state with setted items', () => {
    const items = [
      { displayName: 'item1' },
      { displayName: 'item2' },
      { displayName: 'item3' },
    ];
    const wrapper = shallow(
      <LightIndicatorScreen state="fail" items={items} />
    );
    const listWrapper = wrapper.find(FailedItemList).dive();
    expect(listWrapper.find(FailedItem)).toHaveLength(items.length);
    listWrapper.find(FailedItem).forEach((item, index) => {
      expect(item.dive().text()).toEqual(items[index].displayName);
    });
  });
});
