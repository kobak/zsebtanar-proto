import { pipe } from 'ramda'
import * as React from 'react'
import { connect } from 'react-redux'
import { NavLink, withRouter } from 'react-router-dom'
import { Icon } from 'client-common/component/general/Icon'
import { openSignInModal, openSignUpModal } from 'client-common/store/actions/modal'
import debounce from 'client-common/util/debounce'
import { DonateButton } from '../component/DonateButton'
import { MainClassificationSelector } from '../component/MainClassificationSelector'
import { RouteComponentProps } from 'react-router'
import { withTracker } from 'client-common/component/hoc/withTracker'

interface HomeStateProps {
  session: state.Session
}

interface HomeDispatchProps {
  openSignInModal: typeof openSignInModal
  openSignUpModal: typeof openSignUpModal
}

const mapStateToProps = (state: state.Root) => ({
  session: state.app.session
})

export const Home = pipe(
  withTracker,
  withRouter,
  connect<HomeStateProps, HomeDispatchProps, RouteComponentProps<{}>>(
    mapStateToProps,
    { openSignInModal, openSignUpModal }
  )
)(
  class HomeComponent extends React.Component<
    HomeStateProps & HomeDispatchProps & RouteComponentProps<{}>,
    {}
  > {
    private searchInput = null

    private searchInputChange = debounce(() => {
      this.props.history.push({ pathname: '/search', search: `?q=${this.searchInput.value}` })
    }, 800)

    render() {
      return (
        <div>
          <div className="jumbotron">
            {this.renderWelcome()}
            <div className="my-5 col-11 mx-auto">
              <NavLink to="/search">
                <div className="search-input-group ">
                  <label className="search-label" htmlFor="search-input">
                    <Icon fa="search" size="lg" />
                    <span className="sr-only">Feladat keresés</span>
                  </label>
                  <input
                    id="search-input"
                    type="text"
                    className="form-control"
                    placeholder="Feladat keresés ..."
                    autoFocus
                    ref={inp => (this.searchInput = inp)}
                    onChange={this.searchInputChange}
                  />
                </div>
              </NavLink>
            </div>
          </div>

          <MainClassificationSelector />

          <DonateButton />
        </div>
      )
    }

    private renderWelcome() {
      const { session } = this.props

      if (session.signedIn) {
        return (
          <h1 className="text-center">Szia {session.user.displayName || session.user.email}</h1>
        )
      } else {
        return (
          <div className="text-center">
            <h1>
              <strong>Zsebtanár</strong>
            </h1>
            <h4>Tanulás lépésről lépésre</h4>
          </div>
        )
      }
    }
  }
)
