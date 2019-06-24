import React from 'react';
import CompletedReviewItem from './CompletedReviewItem'
import { Card } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

const CompletedReviewList = ((props) => {
  let completedReviews = [];
  if (props.completedReviews) {
    completedReviews = props.completedReviews.map((completedReview) => {
      return <CompletedReviewItem key={completedReview.id} accounts={props.accounts} web3={props.web3} boomerang={props.boomerang} type={props.type} completedReview={completedReview} />
    })
  }

  return (
    <Card.Group>
      {completedReviews}
    </Card.Group>
  );
})

export default CompletedReviewList;