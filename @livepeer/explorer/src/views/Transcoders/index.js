// @flow
import * as React from 'react'
import { matchPath } from 'react-router-dom'
import BN from 'bn.js'
import { Cpu as CpuIcon } from 'react-feather'
import {
  Avatar,
  Banner,
  BasicNavbar,
  Content,
  PageHeading,
  ScrollToTopOnMount,
  TranscoderCard,
  Wrapper,
} from '../../components'
import enhance from './enhance'

type Transcoder = {
  id: string,
  active: boolean,
  status: string,
  lastRewardRound: string,
  rewardCut: string,
  feeShare: string,
  pricePerSegment: string,
  pendingRewardCut: string,
  pendingFeeShare: string,
  pendingPricePerSegment: string,
  totalStake: string,
}

type Delegator = {
  status: string,
  delegateAddress: string,
  bondedAmount: string,
  fees: string,
  delegatedAmount: string,
  lastClaimRound: string,
  startRound: string,
  withdrawRound: string,
}

type Account = {
  id: string,
  ethBalance: string,
  tokenBalance: string,
  delegator: Delegator,
}

type TranscodersViewProps = {
  bondData: { to: '', amount: '' },
  bondModalVisible: false,
  bondStatus: {
    loading: false,
    error: null,
    success: false,
  },
  bondToken: any => void,
  history: {
    location: {
      search: string,
    },
    push: (url: string) => void,
    replace: (url: string) => void,
  },
  loading: boolean,
  me: Account,
  match: { path: string },
  onBondLPT: (url: string) => Promise<void>,
  setBondData: Object => Object,
  showBondModal: boolean => Object,
  transactions: any,
  transcoders: Array<Transcoder>,
  unbond: any => void,
}

/** Displays a list of transcoders and allows authenticated users to sort and bond/unbond from them */
const TranscodersView: React.ComponentType<TranscodersViewProps> = ({
  error,
  history,
  loading,
  match,
  transcoders,
  me,
  transactions: tx,
  ...props
}) => {
  const { delegator: { bondedAmount, delegateAddress }, tokenBalance } = me
  const searchParams = new URLSearchParams(history.location.search)
  const sort = searchParams.get('sort') || 'totalStake'
  const order = searchParams.get('order') || 'desc'
  const asc = order === 'asc'
  const total = transcoders.length
  const compareFn = createCompareFunction(asc, sort)
  const bondStatus =
    tx.findWhere({
      active: true,
      type: 'BondStatus',
    }) || tx.empty('BondStatus')
  // console.log(bondStatus)
  return (
    <React.Fragment>
      <ScrollToTopOnMount />
      <BasicNavbar onSearch={x => history.push(`/accounts/${x}`)} />
      <Banner height="128px">
        <PageHeading>
          <CpuIcon color="#fff" size={32} />&nbsp;Transcoders
        </PageHeading>
      </Banner>
      <Content>
        {/** Empty State */ !total && (
          <p style={{ textAlign: 'center' }}>
            {loading && 'Loading transcoder data...'}
            {!loading && 'There are no transcoders'}
          </p>
        )}
        {/** Toolbar */ !total ? null : (
          <div style={{ display: 'flex' }}>
            <p>
              Showing 1 - {total} of {total}
            </p>
            <div
              style={{
                display: 'inline-flex',
                flexGrow: 1,
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              <div style={{ marginLeft: 16 }}>
                <span
                  style={{
                    textTransform: 'uppercase',
                    fontSize: 11,
                    letterSpacing: 1,
                  }}
                >
                  sort by: &nbsp;
                </span>
                <select
                  defaultValue={sort}
                  onChange={e => {
                    const { value } = e.target
                    searchParams.set('sort', value)
                    const queryString = searchParams.toString()
                    const url = `${match.path}?${queryString}`
                    history.replace(url)
                  }}
                >
                  <option value="totalStake">Total Stake</option>
                  <option value="rewardCut">Reward Cut</option>
                  <option value="feeShare">Fee Share</option>
                  <option value="pricePerSegment">Price</option>
                </select>
              </div>
              <div style={{ marginLeft: 16 }}>
                <span
                  style={{
                    textTransform: 'uppercase',
                    fontSize: 11,
                    letterSpacing: 1,
                  }}
                >
                  order by: &nbsp;
                </span>
                <select
                  defaultValue={order}
                  onChange={e => {
                    const { value } = e.target
                    searchParams.set('order', value)
                    const queryString = searchParams.toString()
                    const url = `${match.path}?${queryString}`
                    history.replace(url)
                  }}
                >
                  <option value="desc">Desc</option>
                  <option value="asc">Asc</option>
                </select>
              </div>
            </div>
          </div>
        )}
        {/* Results */ [...transcoders].sort(compareFn).map(props => {
          const canBond =
            me.id && (!delegateAddress || props.id === delegateAddress)
          const canUnbond = me.id && props.id === delegateAddress
          const onBond =
            canBond &&
            (() =>
              tx.activate({
                ...bondStatus,
                id: props.id,
              }))
          const onUnbond =
            canUnbond &&
            (() =>
              tx.activate({
                ...bondStatus,
                type: 'UnBondStatus',
              }))
          return (
            <TranscoderCard
              key={props.id}
              {...props}
              bonded={props.id === delegateAddress}
              onBond={onBond || undefined}
              onUnbond={onUnbond || undefined}
            />
          )
        })}
      </Content>
    </React.Fragment>
  )
}

const createCompareFunction = (asc: boolean, sort: string) => (
  a: Transcoder,
  b: Transcoder,
): number => {
  const _a = new BN(a[sort], 10)
  const _b = new BN(b[sort], 10)
  const mul = asc ? 1 : -1
  return _a.cmp(_b) * mul
}

export default enhance(TranscodersView)
