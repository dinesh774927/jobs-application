import {Component} from 'react'
import {BsBriefcaseFill} from 'react-icons/bs'
import {IoLocationSharp} from 'react-icons/io5'
import {MdOpenInNew} from 'react-icons/md'
import {FaStar} from 'react-icons/fa'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'

import './index.css'

const apiStatusJob = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
  initial: 'INITIAL',
}

class JobDetails extends Component {
  state = {apiStatus: apiStatusJob.initial, job: '', similar: []}

  componentDidMount() {
    this.getDetails()
  }

  getDetails = async () => {
    this.setState({apiStatus: apiStatusJob.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch(`https://apis.ccbp.in/jobs/${id}`, options)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      this.setState({
        apiStatus: apiStatusJob.success,
        job: data.job_details,
        similar: data.similar_jobs,
      })
    } else {
      this.setState({apiStatus: apiStatusJob.failure})
    }
  }

  loader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onSuccessJob = () => {
    const {job, similar} = this.state
    return (
      <>
        <Header />
        <div className="jobDetails-container">
          <div className="joblist-container">
            <div className="company-logo-container">
              <img
                className="company-logo"
                alt="job details company logo"
                src={job.company_logo_url}
              />
              <div>
                <h1 className="list-title">{job.title}</h1>
                <div className="rating-container">
                  <FaStar className="rating-logo" />
                  <p className="rating">{job.rating}</p>
                </div>
              </div>
            </div>
            <div className="details-container">
              <div className="location-container">
                <div className="location-container">
                  <IoLocationSharp className="location-logo" />
                  <p className="location">{job.location}</p>
                </div>
                <div className="location-container">
                  <BsBriefcaseFill className="location-logo" />
                  <p className="location">{job.employment_type}</p>
                </div>
              </div>
              <p className="package">{job.package_per_annum}</p>
            </div>
            <hr />
            <div>
              <div className="description-container">
                <h1 className="description-heading">Description</h1>
                <a
                  className="visit"
                  rel="noreferrer"
                  target="_blank"
                  href={job.company_website_url}
                >
                  <p className="visit-name">Visit</p> <MdOpenInNew />
                </a>
              </div>
              <p className="description">{job.job_description}</p>
            </div>
            <h1 className="skill-heading">Skills</h1>
            <ul className="ul-skills">
              {job.skills.map(each => (
                <li className="li-skills" key={each.name}>
                  <img
                    className="skill-img"
                    alt={each.name}
                    src={each.image_url}
                  />
                  <p className="skills">{each.name}</p>
                </li>
              ))}
            </ul>
            <h1 className="skill-heading">Life at Company</h1>
            <div className="life-container">
              <p className="description">{job.life_at_company.description}</p>
              <img
                className="life-img"
                alt="life at company"
                src={job.life_at_company.image_url}
              />
            </div>
          </div>
          <h1 className="similar-heading">Similar Jobs</h1>
          <ul className="ul-similar">
            {similar.map(each => (
              <li key={each.id} className="joblist-container li-similar">
                <div className="company-logo-container">
                  <img
                    className="company-logo"
                    alt="similar job company logo"
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

                <div>
                  <h1 className="description-heading">Description</h1>
                  <p className="description">{each.job_description}</p>
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
                </div>
              </li>
            ))}
          </ul>
        </div>
      </>
    )
  }

  onFailureJob = () => (
    <>
      <Header />
      <div className="jobDetails-container2">
        <img
          className="noJob-img"
          alt="failure view"
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        />
        <h1 className="failure-title">Oops! Something Went Wrong</h1>
        <p className="no-job-para">
          We cannot seem to find the page you are looking for.
        </p>
        <button onClick={this.getDetails} className="retry" type="button">
          Retry
        </button>
      </div>
    </>
  )

  getResult = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusJob.success:
        return this.onSuccessJob()
      case apiStatusJob.failure:
        return this.onFailureJob()
      case apiStatusJob.inProgress:
        return this.loader()
      default:
        return null
    }
  }

  render() {
    return <div>{this.getResult()}</div>
  }
}

export default JobDetails
