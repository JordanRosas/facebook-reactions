  
import React from 'react'
import _ from 'lodash'
import { FacebookCounter, FacebookSelector } from 'react-reactions'

export class Facebook extends React.Component {
  state = {
    reactions:[
      "like",
      "wow",
      'love',
      "haha"
    ],
    counters: [],
    user: 'Jordan Rosas',
    showSelector: true,
  }
  componentDidMount(){
    fetch("http://localhost:5002/users",{
      method:"GET",
      headers:{
        "Accept":'application/json',
        "Content-Type":"application/json"
      }
    })
    .then(res => res.json())
    .then(responseJson => {
      console.log(responseJson)
      let totalCounters = []
      responseJson.map((item) => {
        let counter = {
          emoji: item.reaction,
          by: item.first_name + " " + item.last_name
        };
        totalCounters.push(counter);
        this.setState({
          counters: totalCounters
        })
      })
    })
  }

  handleSelect = (emoji) => {
    const index = _.findIndex(this.state.counters, { by: this.state.user })
    if (index > -1) {
      this.setState({
        counters: [
          ...this.state.counters.slice(0, index),
          { emoji, by: this.state.user },
          ...this.state.counters.slice(index + 1),
        ],
        showSelector: false,
      })
    } else {
      this.setState({
        counters: [...this.state.counters, { emoji, by: this.state.user }],
        showSelector: false,
      })
    }
  }

  render() {
    console.log(this.state)
    return (
      <div style={{ margin:'auto', width:'50%', marginTop:200 }}>
        <div style={{width:200}}>
          <FacebookSelector reactions={this.state.reactions} onSelect={ this.handleSelect } />
        </div>

        <FacebookCounter
            counters={ this.state.counters }
            user={ this.state.user }
            bg="#fafafa"
            important={ ['Henry Boldizsar', 'Rob Sandberg'] }
          />


      </div>
    )
  }
}

export default Facebook