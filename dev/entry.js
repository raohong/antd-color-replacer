import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Button, Steps, Menu, Icon, DatePicker, Checkbox, Row, Col, Input } from 'antd';

import './styles/index.less';
import AntdColorReplacerClient from '../lib/client';

const { Step } = Steps;
const { SubMenu } = Menu;
const { Group } = Checkbox;

const primaryColor = '#1890ff';
const colorList = ['#1890ff', '#F5222D', '#52C41A'];

const ColorTag = ({ color, onClick }) => (
  <div
    onClick={onClick}
    className='tag'
    style={{
      width: 50,
      height: 50,
      backgroundColor: color,
      position: 'relative',
    }}
  />
);

const ColorList = props => {
  const onClick = color => {
    props.onChange(color);
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {colorList.map(color => (
        // @ts-ignore
        <ColorTag
          checked={color === props.color}
          onClick={() => onClick(color)}
          color={color}
          key={color}
        />
      ))}
    </div>
  );
};

const App = () => {
  const [color, setColor] = useState(primaryColor);
  const [collapsed, toggle] = useState(false);

  useEffect(() => {
    AntdColorReplacerClient.compile({
      primaryColor: color,
    });
  });

  return (
    <div>
      <div className='root'>
        <ColorList color={color} onChange={setColor} />
        <p className='text'>
          Introducing the initial release of Firefox Preview (GitHub), an entire browser built from
          the ground up with GeckoView and Mozilla Android Components. Firefox Preview is our
          platform for building, testing, and delivering unique features. Though still an early
          preview, this is our first end-user product built completely with these new
        </p>

        <p className='text'>
          Introducing the initial release of Firefox Preview (GitHub), an entire browser built from
          the ground up with GeckoView and Mozilla Android Components. Firefox Preview is our
          platform for building, testing, and delivering unique features. Though still an early
          preview, this is our first end-user product built completely with these new
        </p>
      </div>
      <Row>
        <Col span={4}>label</Col>
        <Col span={20}>
          <Input style={{ width: '100%' }} />
        </Col>
      </Row>
      <div style={{ padding: 40, backgroundColor: '#fff' }}>
        <Button type='primary'>Primary</Button>
        <Button type='dashed'>dashed</Button>
        <Menu theme='dark' style={{ width: 256 }} defaultOpenKeys={['sub1']} mode='inline'>
          <SubMenu
            key='sub1'
            title={
              <span>
                <Icon type='mail' />
                <span>Navigation One</span>
              </span>
            }
          >
            <SubMenu
              key='sub1212'
              title={
                <span>
                  <Icon type='mail' />
                  <span>Navigation One</span>
                </span>
              }
            >
              <Menu.Item key='11'>Option 1</Menu.Item>
              <Menu.Item key='22'>Option 2</Menu.Item>
              <Menu.Item key='23'>Option 3</Menu.Item>
              <Menu.Item key='24'>Option 4</Menu.Item>
            </SubMenu>
            <Menu.Item key='2'>Option 2</Menu.Item>
            <Menu.Item key='3'>Option 3</Menu.Item>
            <Menu.Item key='4'>Option 4</Menu.Item>
          </SubMenu>
        </Menu>

        <Menu style={{ width: 256 }} defaultOpenKeys={['sub1']} mode='inline'>
          <SubMenu
            key='sub1'
            title={
              <span>
                <Icon type='mail' />
                <span>Navigation One</span>
              </span>
            }
          >
            <SubMenu
              key='sub1212'
              title={
                <span>
                  <Icon type='mail' />
                  <span>Navigation One</span>
                </span>
              }
            >
              <Menu.Item key='11'>Option 1</Menu.Item>
              <Menu.Item key='22'>Option 2</Menu.Item>
              <Menu.Item key='23'>Option 3</Menu.Item>
              <Menu.Item key='24'>Option 4</Menu.Item>
            </SubMenu>
            <Menu.Item key='2'>Option 2</Menu.Item>
            <Menu.Item key='3'>Option 3</Menu.Item>
            <Menu.Item key='4'>Option 4</Menu.Item>
          </SubMenu>
        </Menu>

        <DatePicker disabledDate={n => n.valueOf() > Date.now()} />
        <DatePicker.RangePicker disabledDate={n => n.valueOf() > Date.now()} />
        <Steps direction='vertical' current={1}>
          <Step title='Finished' description='This is a description.' />
          <Step title='In Progress' description='This is a description.' />
          <Step title='Waiting' description='This is a description.' />
        </Steps>
        <Group>
          <Checkbox value={1}>1</Checkbox>
          <Checkbox value={2}>2</Checkbox>
          <Checkbox value={3}>3</Checkbox>
        </Group>
        <Menu
          defaultSelectedKeys={['11']}
          defaultOpenKeys={['sub3']}
          mode='inline'
          theme='dark'
          inlineCollapsed={collapsed}
        >
          <Menu.Item key='1'>
            <Icon type='pie-chart' />
            <span>Option 1</span>
          </Menu.Item>
          <Menu.Item key='2'>
            <Icon type='desktop' />
            <span>Option 2</span>
          </Menu.Item>
          <Menu.Item key='3'>
            <Icon type='inbox' />
            <span>Option 3</span>
          </Menu.Item>
          <SubMenu
            key='sub1'
            title={
              <span>
                <Icon type='mail' />
                <span>Navigation One</span>
              </span>
            }
          >
            <Menu.Item key='5'>Option 5</Menu.Item>
            <Menu.Item key='6'>Option 6</Menu.Item>
            <Menu.Item key='7'>Option 7</Menu.Item>
            <Menu.Item key='8'>Option 8</Menu.Item>
          </SubMenu>
          <SubMenu
            key='sub2'
            title={
              <span>
                <Icon type='appstore' />
                <span>Navigation Two</span>
              </span>
            }
          >
            <Menu.Item key='9'>Option 9</Menu.Item>
            <Menu.Item key='10'>Option 10</Menu.Item>
            <SubMenu key='sub3' title='Submenu'>
              <Menu.Item key='11'>Option 11</Menu.Item>
              <Menu.Item key='12'>Option 12</Menu.Item>
            </SubMenu>
          </SubMenu>
        </Menu>
        <button type='button' className='dark'>
          Toggle Btn
        </button>
        <button type='button' onClick={() => toggle(p => !p)}>
          collapsed
        </button>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
