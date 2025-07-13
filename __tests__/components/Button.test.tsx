import React from 'react';

describe('Basic Test', () => {
  it('should pass basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should render React component', () => {
    const element = React.createElement('div', null, 'Hello World');
    expect(element.props.children).toBe('Hello World');
  });
});