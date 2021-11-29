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

  test('check colors props - default status', () => {
    const wrapper = shallow(<LightIndicatorScreen />);
    expect(wrapper.get(0).props.style).toEqual({
      background: 'linear-gradient(#FF416C, #FF4B2B)',
    });
  });

  test('check colors props - fail status', () => {
    const wrapper = shallow(<LightIndicatorScreen status="fail" />);
    expect(wrapper.get(0).props.style).toEqual({
      background: 'linear-gradient(#FF416C, #FF4B2B)',
    });
  });

  test('check colors props - success status', () => {
    const wrapper = shallow(<LightIndicatorScreen status="success" />);
    expect(wrapper.get(0).props.style).toEqual({
      background: 'linear-gradient(#11998E, #38EF7D)',
    });
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

  test('className for status fail', () => {
    const wrapper = shallow(<LightIndicatorScreen status="fail" />);
    expect(wrapper.props()).toHaveProperty(
      'className',
      'indicator-screen fail'
    );
  });

  test('className for status success', () => {
    const wrapper = shallow(<LightIndicatorScreen status="success" />);
    expect(wrapper.props()).toHaveProperty(
      'className',
      'indicator-screen success'
    );
  });

  test('FailedItemList visible on status fail', () => {
    const wrapper = shallow(<LightIndicatorScreen status="fail" />);
    expect(wrapper.find(FailedItemList)).toHaveLength(1);
  });

  test('FailedItemList visible on status success', () => {
    const wrapper = shallow(<LightIndicatorScreen status="success" />);
    expect(wrapper.find(FailedItemList)).toHaveLength(1);
  });

  test('FailedItemList visible on status fail with setted items', () => {
    const items = [
      { displayName: 'item1' },
      { displayName: 'item2' },
      { displayName: 'item3' },
    ];
    const wrapper = shallow(
      <LightIndicatorScreen status="fail" items={items} />
    );
    const listWrapper = wrapper.find(FailedItemList).dive();
    expect(listWrapper.find(FailedItem)).toHaveLength(items.length);
    listWrapper.find(FailedItem).forEach((item, index) => {
      expect(item.dive().text()).toEqual(items[index].displayName);
    });
  });
});
