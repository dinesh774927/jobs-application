import {Component} from 'react'
import {BsSearch, BsBriefcaseFill} from 'react-icons/bs'
import {IoLocationSharp} from 'react-icons/io5'
import {FaStar} from 'react-icons/fa'
import {Link} from 'react-router-dom'

import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import './index.css'

const apiStatusProfile = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
  initial: 'INITIAL',
}
const apiStatusJob = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
  initial: 'INITIAL',
}
const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]
const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

class Jobs extends Component {
  state = {
    profileStatus: apiStatusProfile.initial,
    jobStatus: apiStatusJob.initial,
    profileData: '',
    employment: [],
    searchInput: '',
    salaryRange: '',
    jobList: [],
  }

  componentDidMount() {
    this.getProfile()
    this.getJobList()
  }

  onChangeSalaryRange = event => {
    this.setState({salaryRange: event.target.value}, this.getJobList)
  }

  onClickEmployment = event => {
    const {employment} = this.state
    const abc = event.target.value
    const check = employment.includes(abc)
    if (check) {
      const newList = employment.filter(each => abc !== each)
      this.setState({employment: newList}, this.getJobList)
    } else {
      employment.push(event.target.value)
      this.setState({employment}, this.getJobList)
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  loader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  getJobList = async () => {
    this.setState({jobStatus: apiStatusJob.inProgress})
    const {searchInput, employment, salaryRange} = this.state
    const emp = employment.join(',')
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch(
      `https://apis.ccbp.in/jobs?employment_type=${emp}&minimum_package=${salaryRange}&search=${searchInput}`,
      options,
    )
    const data = await response.json()
    if (response.ok === true) {
      console.log(data)
      this.setState({jobStatus: apiStatusProfile.success, jobList: data.jobs})
    } else {
      this.setState({jobStatus: apiStatusProfile.failure})
    }
  }

  getProfile = async () => {
    this.setState({profileStatus: apiStatusProfile.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch('https://apis.ccbp.in/profile', options)
    if (response.ok === true) {
      const data = await response.json()

      this.setState({
        profileData: data.profile_details,
        profileStatus: apiStatusProfile.success,
      })
    } else {
      this.setState({profileStatus: apiStatusProfile.failure})
    }
  }

  onSuccessProfile = () => {
    const {profileData} = this.state
    return (
      <div className="profile-container">
        <img
          className="profile-img"
          alt="profile"
          src={profileData.profile_image_url}
        />
        <h1 className="profile-name">{profileData.name}</h1>
        <p className="profile-bio">{profileData.short_bio}</p>
      </div>
    )
  }

  onSuccessJobList = () => {
    const {jobList} = this.state
    if (jobList.length === 0) {
      return (
        <>
          <img
            className="noJob-img"
            alt="no jobs"
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          />
          <h1 className="list-title">No Jobs Found</h1>
          <p className="no-job-para">
            We could not find any jobs. Try other filters.
          </p>
        </>
      )
    }
    return (
      <div>
        <ul className="ul-joblist">
          {jobList.map(each => (
            <li className="joblist-container" key={each.id}>
              <Link className="link" to={`/jobs/${each.id}`}>
                <div className="company-logo-container">
                  <img
                    className="company-logo"
                    alt="company logo"
                    src={each.company_logo_url}
                  />
                  <div>
                    <h1 className="list-title">{each.title}</h1>
                    <div className="rating-container">
                      <FaStar className="rating-logo" />
                      <p className="rating">{each.rating}</p>
                    </div>
                  </div>
                </div>
                <div className="details-container">
                  <div className="location-container">
                    <div className="location-container">
                      <IoLocationSharp className="location-logo" />
                      <p className="location">{each.location}</p>
                    </div>
                    <div className="location-container">
                      <BsBriefcaseFill className="location-logo" />
                      <p className="location">{each.employment_type}</p>
                    </div>
                  </div>
                  <p className="package">{each.package_per_annum}</p>
                </div>
                <hr />
                <div>
                  <h1 className="description-heading">Description</h1>
                  <p className="description">{each.job_description}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  onFailureProfile = () => (
    <div className="fail-p-container">
      <button onClick={this.getProfile} className="retry" type="button">
        Retry
      </button>
    </div>
  )

  statusProfile = () => {
    const {profileStatus} = this.state
    switch (profileStatus) {
      case apiStatusProfile.success:
        return this.onSuccessProfile()
      case apiStatusProfile.failure:
        return this.onFailureProfile()
      case apiStatusProfile.inProgress:
        return this.loader()
      default:
        return null
    }
  }

  onFailureJob = () => (
    <>
      <img
        className="noJob-img"
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
      />
      <h1 className="failure-title">Oops! Something Went Wrong</h1>
      <p className="no-job-para">
        We cannot seem to find the page you are looking for.
      </p>
      <button onClick={this.getJobList} className="retry" type="button">
        Retry
      </button>
    </>
  )

  jobListStatus = () => {
    const {jobStatus} = this.state
    switch (jobStatus) {
      case apiStatusJob.success:
        return this.onSuccessJobList()
      case apiStatusJob.failure:
        return this.onFailureJob()
      case apiStatusJob.inProgress:
        return this.loader()
      default:
        return null
    }
  }

  render() {
    const searchLogo = <BsSearch className="search-icon" />
    const {searchInput, salaryRange} = this.state
    console.log(salaryRange)

    return (
      <>
        <Header />
        <div className="job-container">
          <div className="box1">
            <div className="search-container">
              <input
                value={searchInput}
                onChange={this.onChangeSearchInput}
                placeholder="Search"
                type="search"
                className="job-search-input"
              />
              <button
                onClick={this.getJobList}
                className="search-button"
                type="button"
                data-testid="searchButton"
              >
                {searchLogo}
              </button>
            </div>
            <div className="profile-container1">{this.statusProfile()}</div>
            <hr />
            <div className="employment-container">
              <h1 className="heading-employment">Type of Employment</h1>
              <ul className="ul-employment">
                {employmentTypesList.map(each => (
                  <li key={each.employmentTypeId}>
                    <input
                      onChange={this.onClickEmployment}
                      className="checkbox"
                      type="checkbox"
                      id={each.employmentTypeId}
                      value={each.employmentTypeId}
                    />
                    <label htmlFor={each.employmentTypeId}>{each.label}</label>
                  </li>
                ))}
              </ul>
            </div>
            <hr />
            <div className="employment-container">
              <h1 className="heading-employment">Salary Range</h1>
              <ul className="ul-employment">
                {salaryRangesList.map(each => (
                  <li key={each.salaryRangeId}>
                    <input
                      onChange={this.onChangeSalaryRange}
                      value={each.salaryRangeId}
                      name="options"
                      className="checkbox"
                      type="radio"
                      id={each.salaryRangeId}
                    />
                    <label htmlFor={each.salaryRangeId}>{each.label}</label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <div className="search-container2">
              <input
                value={searchInput}
                onChange={this.onChangeSearchInput}
                placeholder="Search"
                type="search"
                className="job-search-input"
              />
              <button
                onClick={this.getJobList}
                className="search-button"
                type="button"
                data-testid="searchButton"
              >
                {searchLogo}
              </button>
            </div>
            <div className="box2">{this.jobListStatus()}</div>
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
