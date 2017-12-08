import React, { PureComponent } from 'react';
import { Resizable, ResizableBox } from 'react-resizable';
import styled from 'styled-components';
const StyledResizeBox = styled(ResizableBox)`
  display: flex;
  flex-wrap:nowrap;
  position: relative;
  height: 100% !important;
  .react-resizable-handle {
    position: absolute;
    width: 15px;
    height: 100%;
    bottom: 1px;
    right: -5px;
    background-position: bottom right;
    padding: 0 3px 3px 0;
    background-repeat: no-repeat;
    background-origin: content-box;
    box-sizing: border-box;
    cursor: col-resize;
  }
`;

const StyledContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: flex-start;
  padding:${props => props.padding}px;
`;

function curry(targetfn) {
  var numOfArgs = targetfn.length;
  return function fn() {
    if (arguments.length < numOfArgs) {
      return fn.bind(null, ...arguments);
    } else {
      return targetfn.apply(null, arguments);
    }
  }
}

const isFirstColumn = (columnNum, index) => (index % columnNum == 0);
const isLastColumn = (columnNum, index) => isFirstColumn(columnNum, index + 1);
const getColumnNum = (sidebarWidth, itemWidth, minMargin) => Math.floor( sidebarWidth / (itemWidth + minMargin * 2));
const getRemain = (sidebarWidth, columnNum, minMargin, itemWidth) => sidebarWidth - (columnNum * (minMargin * 2 + itemWidth));
const findItemMargin = curry((sidebarWidth, minMargin, rate, itemWidth, index) => {
  const columnNum = getColumnNum(sidebarWidth, itemWidth, minMargin);
  const remain = getRemain(sidebarWidth, columnNum, minMargin, itemWidth);
  const base = remain / columnNum / 2;
  const innerOffset = base * rate;
  const outerOffset = (remain - (innerOffset * (columnNum * 2 - 2) )) / 2;
  return (
    {
      marginLeft: minMargin + (isFirstColumn(columnNum, index) ? outerOffset : innerOffset),
      marginRight: minMargin + (isLastColumn(columnNum, index) ? outerOffset : innerOffset),
    }
  );
});

export default class ResizeBoxWrapper extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      width: this.props.initContainerWidth,
      height: this.props.initContainerHeight,
    }
  }
  onResize = (event, { element, size }) => {
    this.setState({
      width: size.width,
    });
  };
  render() {
    return (
      <div
        className={this.props.className}
        style={{
        ...this.props.style,
        width:this.state.width,
        height:this.state.height,
      }}>
        <StyledResizeBox
          width={this.state.width}
          height={this.state.height}
          axis="x"
          minConstraints={this.props.minConstraints}
          maxConstraints={this.props.maxConstraints}
          onResize={this.onResize}
          onResizeStart={this.props.onResizeStart}
          onResizeStop={this.props.onResizeStop}
        >
          <StyledContainer padding={this.props.initContainerPadding}>
          {this.props.children.map((item, index) => {
            const _item = findItemMargin(this.state.width - this.props.initContainerPadding * 2, this.props.initMargin, this.props.rate, this.props.itemWidth, index);
            const extraStyle = {
              style: {
                ...item.props.style,
                marginLeft: _item.marginLeft,
                marginRight: _item.marginRight,
              }
            }
            return React.cloneElement(item, extraStyle);
          })}
          </StyledContainer>
        </StyledResizeBox>
      </div>
    );
  }
}
