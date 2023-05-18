import React from 'react';
import Style from 'styled-components';
import { Typography } from 'antd';

const { Text } = Typography;

const Wrapper = Style.div`
   display: flex;
   gap: 20px
`
const RightMsg = Style.div`
   text-align: right
`

const CommentsPopover = props => {
  return (
    <Wrapper className="d-flex">
      <span>
        <div><Text underline>{props.leftTitle}:</Text></div>
        {props?.left.length === 0 ?
          '' :
          props?.left.map((item, index) => {
            if (index === 0) {
              return <div key={index}>{item?.text}</div>
            }
            return <div key={index}><br />{item?.text}</div>
          })
        }
      </span>
      <span>
        <div><Text underline>{props.rightTitle}:</Text></div>
        <Text type="success">
          {props?.right.length === 0 ?
            '' :
            props?.right.map((item, index) => <React.Fragment key={index}><br /><RightMsg>{item?.text}</RightMsg><br /></React.Fragment>)
          }
        </Text>
      </span>
    </Wrapper>
  )
}

export default CommentsPopover;