import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

const defaultUser = {
  email: 'arjun+admin@example.com'
}

const Status = {
  new: 'new',
  approved: 'approved',
  scheduled: 'scheduled',
  rejected: 'rejected'
}

const defaultTopics = [
  {
    id: 1,
    title: 'I want to talk about tennis',
    votes: 15,
    status: Status.approved
  },
  {
    id: 210281,
    title: `Let's say mean things about Trump`,
    votes: 8,
    status: Status.new
  },
  {
    id: 3,
    title: 'Who else wants to talk about anime',
    votes: 3,
    status: Status.scheduled
  }
]

class App extends Component {
  state = {
    user: defaultUser,
    topics: defaultTopics,
    chats: []
  }
  render() {
    const { state } = this
    return (
      <Router>
        <div>
          <nav className="nav-bar">
            <div><Link to='/topics'>Topics</Link></div>
            <div><Link to='/scheduled'>Scheduled</Link></div>
            { state.user.email.indexOf('+admin') !== -1 &&
              <div><Link to='/manage'>Manage</Link></div>
            }
          </nav>
          <Route exact path='/' render={() => {
            return <h2>Welcome! Check out the scheduled chats or propose a topic you want to discuss at the next chat!</h2>
          }}/>
          <Route path='/topics' render={() => {
            return <div>
              { state.topics
                  .filter((topic) =>
                    topic.status === Status.approved
                    || topic.status === Status.scheduled
                  )
                  .sort(this.sortTopics)
                  .map((topic) => {
                    return <div key={topic.id}>
                      <button onClick={this.incrementVote(topic)} style={{marginRight: 8}}>+{topic.votes}</button>
                      <span>{topic.title}</span>
                    </div>
              }) }
            </div>
          }}/>
          <Route path='/scheduled' render={() => {
            return <div>
              <h2>Scheduled Chats</h2>
              { state.topics.filter(this.filterTopic(Status.scheduled)).length === 0 &&
                <span>Sorry, no upcoming chats!</span>
              }
              <ul>
                {
                  state.topics.filter(this.filterTopic(Status.scheduled)).map((topic) => {
                    return <li key={topic.id}>{topic.title}</li>
                  })
                }
              </ul>
            </div>
          }}/>
          <Route path='/manage' render={() => {
            return <div>
              <h3>New Topics</h3>
              <ul>
                {
                  this.state.topics
                    .filter(this.filterTopic(Status.new))
                    .map((topic) => {
                      return <li key={topic.id}>
                        {topic.title}
                        <button onClick={this.approveTopic(topic)}>Approve</button>
                        <button onClick={this.rejectTopic(topic)}>Reject</button>
                      </li>
                    })
                }
              </ul>
              <h3>Approved Topics</h3>
              <ul>
                {
                  this.state.topics
                    .filter(this.filterTopic(Status.approved))
                    .map((topic) => {
                      return <li key={topic.id}>
                        {topic.title}
                        <button onClick={this.scheduleTopic(topic)}>Schedule</button>
                      </li>
                    })
                }
              </ul>
            </div>
          }}/>
        </div>
      </Router>
    );
  }

  sortTopics = (a, b) => {
    return a.votes <= b.votes ? 1 : -1
  }

  filterTopic = (status) => (topic) => topic.status === status

  changeStatus = (status, topic) => {
    return this.state.topics.reduce((acc, curr) => {
      if (curr.id === topic.id) {
        acc.push(Object.assign({}, topic, { status }))
      } else {
        acc.push(curr)
      }
      return acc
    }, [])
  }

  approveTopic = (topic) => (e) => {
    this.setState({
      topics: this.changeStatus(Status.approved, topic)
    })
  }

  rejectTopic = (topic) => (e) => {
    this.setState({
      topics: this.changeStatus(Status.rejected, topic)
    })
  }

  scheduleTopic = (topic) => (e) => {
    this.setState({
    topics: this.changeStatus(Status.scheduled, topic)
    })
  }

  incrementVote = (topic) => (e) => {
    const newTopics = this.state.topics.reduce((acc, curr) => {
      if (curr.id === topic.id) {
        acc.push(Object.assign({}, topic, {
          votes: topic.votes + 1
        }))
      } else {
        acc.push(curr);
      }
      return acc;
    }, [])
    this.setState({
      topics: newTopics
    })
  }
}

export default App;
