import {useEffect, useState} from 'react'
import Loader from 'react-loader-spinner'
import {
  LeaderboardContainer,
  LoadingViewContainer,
  ErrorMessage,
} from './styledComponents'

import LeaderboardTable from '../LeaderboardTable'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const Leaderboard = () => {
  const [apiResponse, setStatus] = useState({
    status: apiStatusConstants.initial,
    data: null,
    errorMsg: null,
  })
  // Your code goes here...
  useEffect(() => {
    const getLeaderBoardData = async () => {
      setStatus({
        status: apiStatusConstants.inProgress,
        data: null,
        errorMsg: null,
      })
      const url = 'https://apis.ccbp.in/leaderboard'
      const options = {
        method: 'GET',
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJhaHVsIiwicm9sZSI6IlBSSU1FX1VTRVIiLCJpYXQiOjE2MjMwNjU1MzJ9.D13s5wN3Oh59aa_qtXMo3Ec4wojOx0EZh8Xr5C5sRkU',
        },
      }
      const response = await fetch(url, options)
      const responseData = await response.json()
      if (response.ok === true) {
        setStatus(prev => ({
          ...prev,
          status: apiStatusConstants.success,
          data: responseData,
        }))
      } else {
        setStatus(prev => ({
          ...prev,
          status: apiStatusConstants.failure,
          errorMsg: responseData.error_msg,
        }))
      }
    }
    getLeaderBoardData()
  }, [])

  const renderLoadingView = () => (
    <LoadingViewContainer>
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </LoadingViewContainer>
  )

  const renderSuccessView = () => {
    const {data} = apiResponse
    const formattedData = data.leaderboard_data.map(each => ({
      id: each.id,
      language: each.language,
      name: each.name,
      profileImgUrl: each.profile_image_url,
      rank: each.rank,
      score: each.score,
      timeSpent: each.time_spent,
    }))
    return <LeaderboardTable leaderboardData={formattedData} />
  }
  const renderFailureView = () => {
    const {errorMsg} = apiResponse
    return <ErrorMessage>{errorMsg}</ErrorMessage>
  }

  const renderLeaderboard = () => {
    const {status} = apiResponse
    switch (status) {
      case apiStatusConstants.inProgress:
        return renderLoadingView()
      case apiStatusConstants.success:
        return renderSuccessView()
      case apiStatusConstants.failure:
        return renderFailureView()
      default:
        return null
    }
  }

  return <LeaderboardContainer>{renderLeaderboard()}</LeaderboardContainer>
}

export default Leaderboard
