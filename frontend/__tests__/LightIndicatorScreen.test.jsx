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

  test('check default status class name', () => {
    const wrapper = shallow(<LightIndicatorScreen />);
    expect(wrapper.props()).toHaveProperty(
      'className',
      'indicator-screen idle'
    );
  });

  test.each([{ status: 'success' }, { status: 'fail' }])(
    '$expectedColor for status $status',
    async ({ status }) => {
      const wrapper = shallow(<LightIndicatorScreen status={status} />);
      expect(wrapper.props()).toHaveProperty(
        'className',
        `indicator-screen ${status}`
      );
    }
  );

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
  const items = [
    { displayName: 'item1', href: 'testhref1' },
    { displayName: 'item2', href: 'testhref2' },
    { displayName: 'item3' },
  ];

  test('FailedItemList visible on status fail with setted items', () => {
    const wrapper = shallow(
      <LightIndicatorScreen status="fail" items={items} />
    );
    const listWrapper = wrapper.find(FailedItemList).dive();
    expect(listWrapper.find(FailedItem)).toHaveLength(items.length);
    let actual = [];
    listWrapper.find(FailedItem).forEach((item) => {
      actual.push(item.props());
    });
    expect(actual).toStrictEqual([
      { displayName: 'item1', href: 'testhref1' },
      { displayName: 'item2', href: 'testhref2' },
      { displayName: 'item3', href: '' },
    ]);
  });

  test('success state snapshot', () => {
    const wrapper = shallow(<LightIndicatorScreen status="success" />);
    expect(wrapper.html()).toMatchSnapshot();
  });

  test('fail state snapshot', () => {
    const wrapper = shallow(
      <LightIndicatorScreen status="fail" items={items} />
    );
    expect(wrapper.html()).toMatchSnapshot();
  });
});
