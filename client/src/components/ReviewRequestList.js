import React from 'react';
import ReviewRequestItem from './ReviewRequestItem'
import { Card } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

const ReviewRequestList = ((props) => {
  let reviewRequests = [];
  if (props.reviewRequests) {
    reviewRequests = props.reviewRequests.map((reviewRequest) => {
      return <ReviewRequestItem key={reviewRequest.id} businessList={props.businessList} accounts={props.accounts} web3={props.web3} boomerang={props.boomerang} reviewRequest={reviewRequest} />
    })
  }

  return (
    <Card.Group>
      {reviewRequests}
    </Card.Group>
  );
})

export default ReviewRequestList;