import React, { ReactElement } from 'react'
import { matchPath } from 'react-router'
import { compose, withHandlers } from 'recompose'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { queries } from '@livepeer/graphql-sdk'
import styled, { keyframes } from 'styled-components'
import {
  DownloadCloud as DownloadCloudIcon,
  Plus as PlusIcon,
  Send as SendIcon,
  Zap as VideoIcon,
} from 'react-feather'
import { formatBalance, formatPercentage, pathInfo } from '../../utils'
import { Button, MetricBox, Wrapper } from '../../components'
import enhance from './enhance'

type AccountTranscodingProps = {
  transcoder: Transcoder,
  loading: boolean,
  match: Match,
}

const AccountTranscoding: React.ComponentType<AccountTranscodingProps> = ({
  transcoder,
  loading,
  match,
}) => {
  const {
    active,
    status,
    lastRewardRound,
    rewardCut,
    feeShare,
    pricePerSegment,
    pendingRewardCut,
    pendingFeeShare,
    pendingPricePerSegment,
  } = transcoder
  const me = pathInfo.isMe(match.path)
  return (
    <Wrapper>
      <MetricBox title="Status" value={status} />
      <MetricBox title="Active" value={active ? 'True' : 'False'} />
      <MetricBox
        title="Block Reward Cut"
        suffix="%"
        value={formatPercentage(rewardCut)}
      />
      <MetricBox
        title="Pending Block Reward Cut"
        suffix="%"
        value={formatPercentage(pendingRewardCut)}
      />
      <MetricBox
        title="Fee Share"
        suffix="%"
        value={formatPercentage(feeShare)}
      />
      <MetricBox
        title="Pending Fee Share"
        suffix="%"
        value={formatPercentage(pendingFeeShare)}
      />
      <MetricBox
        title="Price Per Segment"
        suffix="WEI"
        value={pricePerSegment}
        subvalue={`${formatBalance(pricePerSegment, 18)} ETH`}
      />
      <MetricBox
        title="Pending Price Per Segment"
        suffix="WEI"
        value={pendingPricePerSegment}
        subvalue={`${formatBalance(pendingPricePerSegment, 18)} ETH`}
      />
      <MetricBox title="Last Reward Round" value={lastRewardRound} />
    </Wrapper>
  )
}

export default enhance(AccountTranscoding)
