import { pathOr, pipe, values } from 'ramda'
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { selectPublicExercisesById } from 'shared/services/exercise'
import { getAllClassification, TAGS } from 'shared/services/classification'
import Markdown from 'shared/component/general/Markdown'

const mapStateToProps = (state) => ({
  classification: state.classification
})

export default pipe(
  withRouter,
  connect(mapStateToProps)
)(class extends React.Component {
  state = {exercises: undefined}

  componentWillMount () {
    const {subject, topic} = this.props.match.params
    getAllClassification().then(classification => {
      const ids = pathOr([], ['subject', subject, 'topic', topic, 'exercise'], classification)
      selectPublicExercisesById(ids).then(exercises => {
        this.setState({classification, exercises})
      })
    })
  }

  render () {
    const {classification, match} = this.props
    const {subject, topic} = match.params

    if (!classification) return (<div/>)

    return (<div>
      <h2>{classification.subject[subject].name}
        <small>{classification.subject[subject].topic[topic].name}</small>
      </h2>

      {
        !this.state.exercises
          ? <div>Kis türelmet...</div>
          : <div className="list-group col-10 offset-1">
            {
              this.state.exercises.map(ex =>
                <a
                  key={ex._key}
                  href="#"
                  className="list-group-item list-group-item-action d-flex flex-column align-items-start"
                >
                  <div className="mb-1 d-flex w-100 ">
                    <Markdown source={ex.description}/>
                  </div>
                  <div>{
                    ex.classification.tags.map(tag =>
                      <span className="badge badge-default mx-1" key={tag}>{this.state.classification[TAGS][tag].name}</span>
                    )}</div>
                </a>
              )
            }
          </div>
      }
    </div>)
  }
})